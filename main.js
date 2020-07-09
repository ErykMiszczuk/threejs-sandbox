const tardisBlue = new THREE.Color("rgb(0, 49, 111)");
const sunYellow = new THREE.Color("rgb(255, 50, 50)");
const snowWhite = new THREE.Color("rgb(255, 255, 255)");

const scene = new THREE.Scene();
scene.background = tardisBlue;

const camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(2, 3, 4);
const cubeMaterial = new THREE.MeshPhongMaterial({
    color: snowWhite,
    shininess: 50,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const pointLight = new THREE.PointLight(sunYellow, 3);
pointLight.position.z = 20;
pointLight.position.y = -10;
pointLight.position.x = -20;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(sunYellow, 3);
pointLight2.position.z = 20;
pointLight2.position.y = 10;
pointLight2.position.x = 20;
scene.add(pointLight2);

camera.position.z = 25;
cube.rotation.z = 5;
cube.rotation.y = 2;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();