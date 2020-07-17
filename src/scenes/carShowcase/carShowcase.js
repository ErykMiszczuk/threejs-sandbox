import * as THREE from 'three';
import * as R from 'ramda';
import C from 'cannon';

import colors from './colors.js';

export default class Scene {

    constructor() {

        // setting constants 
        this.Width = window.innerWidth;
        this.Height = window.innerHeight;
        this.PixelRatio = window.devicePixelRatio;
        this.AspectRatio = this.Width / this.Height;
        this.NearPlane = 1;
        this.FarPlane = 1000;

        // prepare to draw scene
        this.setup();
    }

    setup() {
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        })
        //enable shadows in scene
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.Width, this.Height);
        this.renderer.setPixelRatio(this.PixelRatio);
        this.renderer.setClearColor(colors.skyBlue);

        document.body.appendChild(this.renderer.domElement)

        //start drawing loop
        this.renderer.setAnimationLoop(() => this.draw())
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }

    setupLights() {
        const directionalLight = new THREE.DirectionalLight(colors.daylight, 0.9);
        // create target for directional light, for controling direction of light
        const target = new THREE.Object3D();
        target.position.set(new THREE.Vector3());
        // add target to directional light
        directionalLight.target = target;
        // add light to scene
        this.scene.add(directionalLight);
        // just in case adding target to scene
        this.scene.add(directionalLight.target)
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(50, this.AspectRatio, this.NearPlane, this.FarPlane);
        this.camera.position.set(10, 10, -10);
        this.camera.lookAt(new THREE.Vector3());
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }
}