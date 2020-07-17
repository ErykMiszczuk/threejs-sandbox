import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
const urlToModel = 'static/280/datsun3.gltf';
const envMapPath = 'static/environmentMaps/garage_1k.hdr'

export default class Car {
    constructor(parentScene, generator) {
        this.parentScene = parentScene;
        this.pmremGenerator = generator;
        this.gltfLoader = new GLTFLoader();
        this.gltfLoaderStatus = '';
        this.rgbeLoader = new RGBELoader();
        this.rgbeLoaderStatus = '';

        this.loadEnvMap();
    }

    loadEnvMap() {
        this.rgbeLoader.load(
            envMapPath,
            textureEnv => {
                const envMap = this.pmremGenerator.fromEquirectangular(textureEnv).texture;
                this.parentScene.background = envMap;
                this.parentScene.environment = envMap;

                textureEnv.dispose()
                this.pmremGenerator.dispose();

                this.loadModel()
            },
            progress => this.rgbeLoaderStatus = progress,
            err => console.error(err),
        )
    }

    loadModel() {
        this.gltfLoader.load(
            urlToModel,
            loadedModel => {
                const model = loadedModel.scene.children[0];
                model.rotateZ(90);
                model.castShadow = true;
                this.parentScene.add(model)
            },
            progress => this.gltfLoaderStatus = progress,
            err => console.error(err) 
        )
    }
}