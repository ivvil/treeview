import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { PageGraph } from "./data.js";
import { render } from "./renderer.js"

const response = await fetch("testdata.json");

const json = await response.json();

const pageGraph = PageGraph.deserialize(json);

if (WebGL.isWebGL2Available()) {
	// Do init stuff
} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById('container').appendChild(warning);
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

render(pageGraph, scene);

const geometry = new THREE.BoxGeometry(1, 1, 1);

const wireframe = new THREE.WireframeGeometry(geometry);

const lineMat = new THREE.LineBasicMaterial({
	color: 0xffffff,
	linewidth: 10
})

const line = new THREE.LineSegments(wireframe, lineMat);

line.material.depthTest = true;
line.material.opacity = 0;
line.material.transparent = false;

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// scene.add(line);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, 100);
controls.update();

function animate() {
	// Rotate cube
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	line.rotation.x = cube.rotation.x;
	line.rotation.y = cube.rotation.y;
	controls.update();

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
