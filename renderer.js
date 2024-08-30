import * as THREE from 'three';
import { PageGraph } from "./data";

export { render };

/**
 * Renders a Graph into the viewport
 * @param {PageGraph} graph - The graph to render
 * @param {THREE.Scene} scene - The threejs scene to render to
 */
function render(graph, scene) {
  const nodes = new Map();
  const positions = new Map();

  let angle = 0;
  let radius = 5;
  let angleIncrement = (2 * Math.PI) / graph.pages.size;
  
  // Nodes
  for (const [id, page] of graph.pages) {
	const pos = new THREE.Vector3(
	  radius * Math.cos(angle),
	  radius * Math.sin(angle),
	  Math.random() * 2 - 1		// Random z
	)

	const node = createNode(pos, id);
	scene.add(node);
	nodes.set(id, node);
	positions.set(id, pos);

	angle += angleIncrement;
  }

  // Links
  for (const [id, page] of graph.pages) {
	const startPos = positions.get(id);

	for (const link of page.links) {
	  const endPos = positions.get(link.id);

	  if (endPos) {
		const linkLine = createLink(startPos, endPos);
		scene.add(linkLine);
	  }
	}
  }
}

/**
 * Creates a 3D node (sphere) for the graph.
 * @param {THREE.Vector3} position - The position of the node in 3D space.
 * @param {string} id - The unique identifier of the node.
 * @returns {THREE.Mesh} - The created node mesh.
 */
function createNode(position, id) {
  const geometry = new THREE.SphereGeometry(0.3, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.set(position);
  sphere.userData = { id };
  return sphere;
}

/**
 * Creates a 3D link (line) between two nodes.
 * @param {THREE.Vector3} start - The starting position of the link.
 * @param {THREE.Vector3} end - The ending position of the link.
 * @returns {THREE.Line} - The created link line.
 */
function createLink(start, end) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);

  return line;
}

