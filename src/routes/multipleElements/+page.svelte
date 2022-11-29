<script lang="ts">
	import '../../app.css';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let renderer: THREE.WebGLRenderer;
	let content: HTMLDivElement;

	let scenes: THREE.Scene[] = [];

	function init() {
		const geometries = [
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.SphereGeometry(0.5, 12, 8),
			new THREE.DodecahedronGeometry(0.5),
			new THREE.CylinderGeometry(0.5, 0.5, 1, 12)
		];

		for (let i = 0; i < 10; i++) {
			const scene = new THREE.Scene();

			// make a list item
			const element = document.createElement('div');
			element.className = 'list-item';

			const sceneElement = document.createElement('div');
			sceneElement.style.width = '200px';
			sceneElement.style.height = '200px';
			element.appendChild(sceneElement);

			const descriptionElement = document.createElement('div');
			descriptionElement.innerText = 'Scene ' + (i + 1);
			element.appendChild(descriptionElement);

			// the element that represents the area we want to render the scene
			scene.userData.element = sceneElement;
			content.appendChild(element);

			const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
			camera.position.z = 2;
			scene.userData.camera = camera;

			const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
			controls.minDistance = 2;
			controls.maxDistance = 5;
			controls.enablePan = false;
			controls.enableZoom = false;
			scene.userData.controls = controls;

			// add one random mesh to each scene
			const geometry = geometries[(geometries.length * Math.random()) | 0];

			const material = new THREE.MeshStandardMaterial({
				color: new THREE.Color().setHSL(Math.random(), 1, 0.75),
				roughness: 0.5,
				metalness: 0,
				flatShading: true
			});

			scene.add(new THREE.Mesh(geometry, material));

			scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

			const light = new THREE.DirectionalLight(0xffffff, 0.5);
			light.position.set(1, 1, 1);
			scene.add(light);

			scenes.push(scene);
		}
	}

	function updateSize() {
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		if (canvas.width !== width || canvas.height !== height) {
			renderer.setSize(width, height, false);
		}
	}

	function animate() {
		render();
		requestAnimationFrame(animate);
	}

	function render() {
		if (!renderer) return;
		updateSize();

		canvas.style.transform = `translateY(${window.scrollY}px)`;

		renderer.setClearColor(0xffffff);
		renderer.setScissorTest(false);
		renderer.clear();

		renderer.setClearColor(0xe0e0e0);
		renderer.setScissorTest(true);

		scenes.forEach(function (scene) {
			// so something moves
			scene.children[0].rotation.y = Date.now() * 0.001;

			// get the element that is a place holder for where we want to
			// draw the scene
			const element = scene.userData.element;

			// get its position relative to the page's viewport
			const rect = element.getBoundingClientRect();

			// check if it's offscreen. If so skip it
			if (
				rect.bottom < 0 ||
				rect.top > renderer.domElement.clientHeight ||
				rect.right < 0 ||
				rect.left > renderer.domElement.clientWidth
			) {
				return; // it's off screen
			}

			// set the viewport
			const width = rect.right - rect.left;
			const height = rect.bottom - rect.top;
			const left = rect.left;
			const bottom = renderer.domElement.clientHeight - rect.bottom;

			renderer.setViewport(left, bottom, width, height);
			renderer.setScissor(left, bottom, width, height);

			const camera = scene.userData.camera;

			//camera.aspect = width / height; // not changing in this example
			//camera.updateProjectionMatrix();

			//scene.userData.controls.update();

			renderer.render(scene, camera);
		});
	}

	onMount(() => {
		init();
		animate();
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		return () => {
			scenes = [];
			renderer.dispose();
		};
	});
</script>

<svelte:head>
	<title>three.js webgl - multiple elements</title>
</svelte:head>

<canvas class="absolute w-full h-full left-0" bind:this={canvas} />

<div class="w-full z-[1] pt-12 top-0 absolute">
	<div id="info">
		<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - multiple elements - webgl
	</div>
	<div class="overflow-y-scroll" bind:this={content} />
</div>

<style>
	.list-item {
		margin: 1em;
		padding: 1em;
		box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.25);
	}

	.renderdiv {
		width: 200px;
		height: 200px;
	}

	.list-item > div:nth-child(2) {
		color: #888;
		font-family: sans-serif;
		font-size: large;
		width: 200px;
		margin-top: 0.5em;
	}
</style>
