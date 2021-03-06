import * as THREE from 'three';
import font from './fonts/helvetiker_bold.typeface.json';
import C from 'cannon';
import * as R from 'ramda';
// const fontStringified = JSON.stringify(font);
const margin = 7;
const totalMass = 1;
const force = 25;
const starWarsYellow = new THREE.Color("rgb(255,220,0)")

export default class Menu {
    constructor(scene, world, camera, mouse, raycaster) {
        this.navItems = document.querySelectorAll(".mainNav a")

        this.scene = scene;

        this.camera = camera;
        this.mouse = mouse;
        this.raycaster = raycaster;

        this.world = world;
        this.offset = this.navItems.length * margin * 0.3;

        this.fontLoader = new THREE.FontLoader();

        this.words = new THREE.Group();

        this.customFont = new THREE.Font(font);
        // console.log(this.customFont);

        this.setup(this.customFont);
        // this.fontLoader.load(fontStringified, f => {
        //     this.setup(f)
        // });
        document.addEventListener("click", () => this.onClickHandler())
    }

    setup(f) {

        const groundMat = new C.Material();
        const letterMat = new C.Material();

        const contactMaterial = new C.ContactMaterial(groundMat, letterMat, {
            friction: 0.01
        })

        this.world.addContactMaterial(contactMaterial);

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
                position: new C.Vec3(0, i * margin - this.offset, 0),
                material: groundMat
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

                words.letterOff += mesh.size.x * 1.15;

                const box = new C.Box(new C.Vec3().copy(mesh.size).scale(0.5));

                mesh.body = new C.Body({
                    mass: totalMass / innerText.length,
                    position: new C.Vec3(words.letterOff, this.getOffsetY(i), 0),
                    material: letterMat
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

        this.setContrains()
    }

    onClickHandler() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        // It will return an array with intersecting objects
        const intersects = this.raycaster.intersectObjects(
            this.scene.children,
            true
        );

        if (intersects.length > 0) {
            const obj = R.head(intersects);
            const { object, face } = obj;

            if (!object.isMesh) return;

            const impulse = new THREE.Vector3()
            .copy(face.normal)
            .negate()
            .multiplyScalar(force);

            this.words.children.forEach((word, i) => {
                word.children.forEach(letter => {
                    const { body } = letter;

                    if (letter !== object) return;

                    // We apply the vector 'impulse' on the base of our body
                    body.applyLocalImpulse(impulse, new C.Vec3());
                });
            });
        }
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

    setContrains() {
        this.words.children.forEach(word => {
            word.children.map((letter, i) => {
                const nextLetter = i === word.children.length - 1 ? null : word.children[i + 1];
                if (nextLetter === null) return;

                const c = new C.ConeTwistConstraint(letter.body, nextLetter.body, {
                    pivotA: new C.Vec3(letter.size.x, 0, 0),
                    pivotB: new C.Vec3(0, 0, 0)
                })

                c.collideConnected = true;
                this.world.addConstraint(c);
            })
        })
    }

    getOffsetY(i) {
        return i * margin * 2;
    }
}