import * as THREE from 'three';
import font from './fonts/helvetiker_bold.typeface.json';
const fontStringified = JSON.stringify(font);

export default class Menu {
    constructor(scene) {
        this.navItems = document.querySelectorAll(".mainNav a")

        this.scene = scene;
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

            Array.from(innerText).forEach((letter, j) => {
                const material = new THREE.MeshPhongMaterial({ color: 0x97df5e });
                const geometry = new THREE.TextGeometry(letter, fontOption);

                const mesh = new THREE.Mesh(geometry, material);
                words.add(mesh);
            });

            this.words.add(words);
            this.scene.add(this.words);
        })
    }
}