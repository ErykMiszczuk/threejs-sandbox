import * as THREE from 'three';
import audioFile from '../../../assets/music/your_music_here.mp3';
import fragmentShader from './fragmentShader.frag';
import vertexShader from './vertexShader.vert';

var scene, camera, renderer, analyser, uniforms;

document.body.innerHTML = `<div id="overlay">
<button id="startButton">Play</button>
</div>
<div id="container"></div>`;

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

function init() {

    var fftSize = 64;

    //

    var overlay = document.getElementById( 'overlay' );
    overlay.remove();

    //

    var container = document.getElementById( 'container' );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.Camera();


    var listener = new THREE.AudioListener();

    var audio = new THREE.Audio( listener );
    var file = audioFile;

    if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {

        var loader = new THREE.AudioLoader();
        loader.load( file, function ( buffer ) {

            audio.setBuffer( buffer );
            audio.play();

        } );

    } else {

        var mediaElement = new Audio( file );
        mediaElement.play();

        audio.setMediaElementSource( mediaElement );

    }

    analyser = new THREE.AudioAnalyser( audio, fftSize );

    uniforms = {
        tAudioData: { value: new THREE.DataTexture( analyser.data, fftSize / 2.8, 1, THREE.LuminanceFormat ) }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader,
        fragmentShader,

    } );

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );


    window.addEventListener( 'resize', onResize, false );

    animate();

}

function onResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    analyser.getFrequencyData();

    uniforms.tAudioData.value.needsUpdate = true;

    renderer.render( scene, camera );
}