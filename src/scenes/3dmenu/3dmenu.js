import * as THREE from 'three';
import * as R from 'ramda';
import Menu from './Menu.js';
import C from 'cannon';

const starWarsYellow = new THREE.Color("rgb(255,220,0)");
const snowWhite = new THREE.Color("rgb(255, 255, 255)");

export default class Scene {

    constructor() {
        this.container = document.getElementById("stage");
    
        this.W = window.innerWidth;
        this.H = window.innerHeight;

        this.mouse = new THREE.Vector2()
        this.INTERSECTED;
        this.raycaster = new THREE.Raycaster();
    
        this.setup();
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener("resize", () => {
            this.onResize();
        });
        window.addEventListener( 'mousemove', event => {
            event.preventDefault();
            this.updateMouse(event);
        });
    }

    onCanvasMouseMove(event) {
        console.log(arguments)
        event.preventDefault();

        this.updateMouse(event);
    }

    updateMouse(event) {
        this.mouse.x = (event.clientX / this.W) * 2 - 1;
        this.mouse.y = - (event.clientY / this.H) * 2 + 1;
    }

    setup() {

        this.world = new C.World();
        this.world.gravity.set(0, -50, 0);

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x202533, -1, 100);

        this.clock = new THREE.Clock();

        this.setRenderer();
        
        this.addObjects();
        
        this.setCamera();
        this.setLights();

        this.renderer.setAnimationLoop(() => this.draw())
    }

    setCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const distance = 15;

        this.camera = new THREE.OrthographicCamera(-distance * aspect, distance * aspect, distance, -distance, -1, 100);

        this.camera.position.set(-10, 10, 10);
        this.camera.lookAt(new THREE.Vector3());
    }

    setLights() {
        const ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);
    
        const foreLight = new THREE.DirectionalLight(0xffffff, 0.5);
        foreLight.position.set(5, 5, 20);
        this.scene.add(foreLight);
    
        const backLight = new THREE.DirectionalLight(0xffffff, 1);
        backLight.position.set(-5, -5, -10);
        this.scene.add(backLight);
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.container
        });
    
        this.renderer.setClearColor(0x202533);
        this.renderer.setSize(this.W, this.H);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    
        this.renderer.shadowMap.enabled = true;
    
        this.renderer.setAnimationLoop(() => {
            this.draw();
        });
    }

    onResize() {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
    
        this.camera.aspect = this.W / this.H;
    
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.W, this.H);
    }

    draw() {
        this.updatePhysics();
        this.findMousePointedObjects();
        this.renderer.render(this.scene, this.camera);
    }

    addObjects() {
        this.menu = new Menu(this.scene, this.world)
    }

    updateObjects() {
        this.childrenArray = this.scene.children[0];
    }

    updatePhysics() {
        this.menu.update();
        this.world.step(1 / 60);
    }

    findMousePointedObjects() {
        this.camera.lookAt(this.scene.position)
        this.camera.updateMatrixWorld();

        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects > 0) {
            const intersected = intersects[0].object;
            intersected.customDepthMaterial.color = snowWhite;
        }
    }
}