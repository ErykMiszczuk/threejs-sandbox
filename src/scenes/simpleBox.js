import * as THREE from 'three';

const tardisBlue = new THREE.Color("rgb(0, 49, 111)");
const sunYellow = new THREE.Color("rgb(200, 150, 0)");
const snowWhite = new THREE.Color("rgb(255, 255, 255)");

const scene = new THREE.Scene();
scene.background = tardisBlue;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;

const camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(2, 3, 4);
const cubeMaterial = new THREE.MeshPhongMaterial({
    color: sunYellow,
    shininess: 50,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const pointLight = new THREE.PointLight(snowWhite, 1.5);
pointLight.position.set(-20, -10, 20);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(snowWhite, 1.5); 
pointLight2.position.set(20, 10, 20);
scene.add(pointLight2);

camera.position.z = 25;

window.addEventListener( 'mousemove', event => {
    event.preventDefault();
    updateMouse(event);
});

function updateMouse(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.05;
    findMousePointedObjects();
    renderer.render(scene, camera);
}

function findMousePointedObjects() {
    camera.lookAt( scene.position );

    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {
            console.log(intersects)
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.color = snowWhite;
            
        }
        
    } else {
        if (INTERSECTED !== null) INTERSECTED.material.color = sunYellow;

        INTERSECTED = null;

    }
}

animate();