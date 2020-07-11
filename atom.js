const tardisBlue = new THREE.Color("rgb(0, 49, 111)");
const sunYellow = new THREE.Color("rgb(200, 150, 0)");
const snowWhite = new THREE.Color("rgb(255, 255, 255)");

const scene = new THREE.Scene();
scene.background = tardisBlue;

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 50);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createSphere(r = 1, color = snowWhite) {
    const sphereGeo = new THREE.SphereGeometry(r, 20, 20);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color,
        shininess: 30
    });
    return new THREE.Mesh(sphereGeo, sphereMaterial);
}

function createPointLight(intensity = 1, color = snowWhite) {
    return new THREE.PointLight(color, intensity);
}

function createElectron(r = 0.55, color = snowWhite) {
    const sphere = createSphere(r, color);
    const pivot = new THREE.Object3D();
    pivot.add(sphere);
    return {
        pivot,
        sphere
    }
}

const nucleus = createSphere(3);
const l1 = createPointLight(.85);
const l2 = createPointLight(.65);
l1.position.set(60, 20, 60);
l2.position.set(-30, 0, 20);

scene.add(nucleus, l1, l2);

const electron1 = createElectron();
electron1.sphere.position.set(10, 0, 0);
const electron3 = createElectron();
const electron4 = createElectron();
const electron2 = createElectron();
electron2.sphere.position.set(5, 0, 0);
electron3.sphere.position.set(-5, 0, 0);
electron4.sphere.position.set(-10, 0, 0);

nucleus.add(electron1.pivot, electron2.pivot, electron3.pivot, electron4.pivot);

function animate() {
    electron1.pivot.rotation.z += 0.01;
    nucleus.rotation.x += 0.002;
    nucleus.rotation.y += 0.003;
    nucleus.rotation.z += 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function handleResize() {
    const { innerWidth, innerHeight } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", handleResize)
animate();