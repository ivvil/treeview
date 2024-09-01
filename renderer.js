import * as THREE from 'three';
import { PageGraph } from "./data";

export { render, rankLength };

/**
 * Renders a Graph into the viewport
 * @param {PageGraph} graph - The graph to render
 * @param {THREE.Scene} scene - The threejs scene to render to
 */
function render(graph, scene) {
	const nodes = new Map();
	const positions = new Map();
	const ranking = rankLength(graph);

	// let angle = 0;
	let radius = 50;
	let layerHeight = 50;

	for (var i = 0; i < ranking.length; i++) {
		let angle = 0;
		let angleIncrement = (2 * Math.PI) / ranking[i].size;

		for (let page of ranking[i]) {
			const pos = new THREE.Vector3(
				radius * Math.cos(angle),
				radius * Math.sin(angle),
				i * layerHeight
			);

			const node = createNode(pos, page);
			// node.position.set(5, 0, 0);
			scene.add(node);
			nodes.set(page, node);
			positions.set(page, pos);

			angle += angleIncrement;
		}




	}

	// // Nodes
	// for (const [id, page] of graph.pages) {
	// 	const pos = new THREE.Vector3(
	// 		radius * Math.cos(angle),
	// 		radius * Math.sin(angle),
	// 		Math.random() * 2 - 1		// Random z
	// 	)

	// 	const node = createNode(pos, id);
	// 	scene.add(node);
	// 	nodes.set(id, node);
	// 	positions.set(id, pos);

	// 	angle += angleIncrement;
	// }

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
	console.log(position);

	const geometry = new THREE.BoxGeometry(10, 16, 16);
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const sphere = new THREE.Mesh(geometry, material);

	sphere.position.set(position.x, position.y, position.z);
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


/**
 * Ranks the pages of a graph based on their connections to the index page using BFS.
 * @param {PageGraph} graph - The PageGraph to rank.
 * @returns {Array<Set<String>>} - The rank of the pages
 */
function rankLength(graph) {
	const rank = [];
	const queue = ["index"];  // Start with the index page
	const visited = new Set(["index"]);  // Visited pages
	rank.push(new Set(["index"]));  // Initialize the first layer

	while (queue.length > 0) {
		const currLayer = new Set();
		const nextQueue = [];  // Temporary queue for next layer

		for (const pageId of queue) {
			const page = graph.pages.get(pageId);

			// Process each link
			for (const link of page.links) {
				if (!visited.has(link.id)) {
					visited.add(link.id);
					currLayer.add(link.id);
					nextQueue.push(link.id);
				}
			}
		}

		if (currLayer.size > 0) {
			rank.push(currLayer);
		}

		queue.length = 0;  // Clear the queue
		queue.push(...nextQueue);  // Prepare for the next
	}

	return rank;
}

