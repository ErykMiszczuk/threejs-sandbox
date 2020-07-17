import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const urlToModel = 'static/280/datsun3.gltf';

export default class Car {
    constructor(parentScene) {
        this.parentScene = parentScene;
        this.loader = new GLTFLoader();
        this.loadProgress = '';

        this.loadModel();
    }

    loadModel() {
        this.loader.load(
            urlToModel,
            loadedModel => {
                const model = loadedModel.scene.children[0];
                model.rotateZ(90);
                model.castShadow = true;
                console.log(model);
                this.parentScene.add(model)
            },
            progress => this.loadProgress = progress,
            err => console.error(err) 
        )
    }
}