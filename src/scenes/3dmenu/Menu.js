import * as THREE from 'three';
import font from './fonts/helvetiker_bold.typeface.json';
import C from 'cannon';
import { RGBADepthPacking } from 'three';
// const fontStringified = JSON.stringify(font);
const margin = 6;
const totalMass = 1;
const starWarsYellow = new THREE.Color("rgb(255,220,0)")

export default class Menu {
    constructor(scene, world) {
        this.navItems = document.querySelectorAll(".mainNav a")

        this.scene = scene;

        this.world = world;
        this.offset = this.navItems.length * margin * 0.5;

        this.fontLoader = new THREE.FontLoader();

        this.words = new THREE.Group();

        this.customFont = new THREE.Font(font);
        // console.log(this.customFont);

        this.setup(this.customFont);
        // this.fontLoader.load(fontStringified, f => {
        //     this.setup(f)
        // });
    }

    setup(f) {
        const fontOption = {
            font: f,
            size: 3,
            height: 0.4,
            curveSegments: 24,
            bevelEnabled: true,
            bevelThickness: 0.9,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 10,
        }

        Array.from(this.navItems).reverse().forEach((item, i) => {
            const { innerText } = item;
            const words = new THREE.Group();

            words.letterOff = 0;

            words.ground = new C.Body({
                mass: 0,
                shape: new C.Box(new C.Vec3(50, 0.1, 50)),
                position: new C.Vec3(0, i * margin - this.offset, 0)
            });
      
            this.world.addBody(words.ground);

            Array.from(innerText).forEach((letter, j) => {
                const material = new THREE.MeshPhongMaterial({ color: starWarsYellow });
                const geometry = new THREE.TextGeometry(letter, fontOption);

                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();

                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                mesh.size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());

                words.letterOff += mesh.size.x;

                const box = new C.Box(new C.Vec3().copy(mesh.size).scale(0.5));

                mesh.body = new C.Body({
                    mass: totalMass / innerText.length,
                    position: new C.Vec3(words.letterOff, this.getOffsetY(i), 0)
                });

                const { center } = mesh.geometry.boundingSphere;
                mesh.body.addShape(box, new C.Vec3(center.x, center.y, center.z));

                this.world.addBody(mesh.body);

                words.add(mesh);
            });

            words.children.forEach(letter => {
                letter.body.position.x -= letter.size.x + words.letterOff * 0.5;
            })

            this.words.add(words);
            this.scene.add(this.words);
        })
    }

    update() {
        if (!this.words.children) return;
    
        this.words.children.forEach((word, j) => {
          for (let i = 0; i < word.children.length; i++) {
            const letter = word.children[i];
    
            letter.position.copy(letter.body.position);
            letter.quaternion.copy(letter.body.quaternion);
          }
        });
      }

    getOffsetY(i) {
        return (this.navItems.length - i - 1) * margin - this.offset;
    }
}