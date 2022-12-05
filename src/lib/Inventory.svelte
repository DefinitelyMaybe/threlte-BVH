<script>
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
	import { onMount } from 'svelte';
	import { Vector3 } from 'three';

	export let show = false;

	THREE.Cache.enabled = true;

	let canvas;
	let renderer;

	let content;
	let content2;
	let modelPreview;

	let scenes = [];

	const loader = new GLTFLoader();
	let model;

	loader.load('/dungeon.glb', (gltf) => {
		console.log(gltf);
		model = gltf;
	});

	let author = 'unknown';
	let authorURL = '';
	let license = 'unknown';
	let licenseURL = '';

	let objects = [];

	const geometries = {};
	const materials = {};

	$: if (model) {
		let x = model.asset.extras.author.split(' ');
		author = x[0];
		authorURL = x[1].slice(1, -1);

		x = model.asset.extras.license.split(' ');
		license = x[0];
		licenseURL = x[1].slice(1, -1);

		// reducing the size of the initial scene
		model.scene.scale.setScalar(0.001);

		const sceneSize = new THREE.Vector3();

		// centering the scene
		const box = new THREE.Box3();
		box.setFromObject(model.scene);
		box.getCenter(model.scene.position).negate();

		box.getSize(sceneSize);

		model.scene.traverse((obj) => {
			// now I need to find unique geometry and materials
			if (obj.geometry) {
				let similarBox = false;
				for (const key in geometries) {
					const existingBox = geometries[key].box;
					if (obj.geometry.boundingBox?.equals(existingBox)) {
						similarBox = true;
					}
				}
				if (!similarBox) {
					geometries[obj.uuid] = {
						box: obj.geometry.boundingBox,
						name: obj.name,
						geometry: obj.geometry
					};
				}
				// group by bounding boxes
			}
			if (obj.material) {
				if (!(obj.material.name in materials)) {
					materials[obj.material.name] = obj.material;
				}
			}
		});

		for (const key in geometries) {
			// match the geometry name with the material
			const name = geometries[key].name;

			let material;

			for (const key in materials) {
				const reg = new RegExp(key, 'g');
				const match = name.match(reg);
				if (match) {
					material = materials[key];
				}
			}

			const geometry = geometries[key].geometry;

			const mesh = new THREE.Mesh(geometry, material);
			mesh.name = name;

			objects.push(mesh);
		}

		for (let i = 0; i < objects.length; i++) {
			const element = objects[i];
			scenes.push(createScene(element, content2));
		}
		scenes.push(createScene(model.scene, modelPreview));
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
		if (!renderer || !canvas) return;
		updateSize();

		canvas.style.transform = `translateY(${window.scrollY}px)`;

		renderer.setClearColor(0xffffff);
		renderer.setScissorTest(false);
		renderer.clear();

		renderer.setClearColor(0xe0e0e0);
		renderer.setScissorTest(true);

		scenes.forEach((scene) => {
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

			renderer.render(scene, camera);
		});
	}

	function createScene(object, dom) {
		const scene = new THREE.Scene();

		// make a list item
		const element = document.createElement('div');

		const sceneElement = document.createElement('div');
		sceneElement.style.width = '200px';
		sceneElement.style.height = '200px';
		element.appendChild(sceneElement);

		const descriptionElement = document.createElement('div');
		if (object.name) {
			descriptionElement.innerText = object.name;
		} else {
			descriptionElement.innerText = 'Scene';
		}

		element.appendChild(descriptionElement);

		// the element that represents the area we want to render the scene
		scene.userData.element = sceneElement;
		dom.appendChild(element);

		const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 100);
		camera.position.x = 2;
		camera.position.y = 2;
		camera.position.z = 2;
		camera.lookAt(new Vector3(0, 0, 0));
		scene.userData.camera = camera;

		const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
		scene.userData.controls = controls;

		scene.add(object);

		scene.add(new THREE.AmbientLight(0x404040, 1));

		const light = new THREE.DirectionalLight();
		light.position.set(1, 1, 1);
		light.lookAt(new THREE.Vector3(0, 0, 0));
		scene.add(light);

		return scene;
	}

	onMount(() => {
		animate();
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		// composer = new EffectComposer(renderer);
		return () => {
			scenes = [];
			renderer.dispose();
		};
	});
</script>

<section class="pointer-events-auto overflow-y-scroll h-full relative" class:hidden={!show}>
	<canvas class="absolute w-full h-full left-0" bind:this={canvas} />

	<div class="w-full top-0 absolute">
		<div id="info">
			<a href="https://threejs.org">three.js</a> - multiple elements - webgl
		</div>
		<div class="overflow-y-auto grid grid-cols-4" bind:this={content} />
		<div>
			<h1>{model?.asset.extras.title ?? 'GLTF'}</h1>
			<div bind:this={modelPreview} class="w-[200px] h-[200px] mb-4" />
			<div class="flex flex-col">
				{#if model}
					<a href={authorURL}>{author}</a>
					<div>
						<a href={model?.asset.extras.source}>source</a> -
						<a href={licenseURL}>{license}</a>
					</div>
				{:else}
					A GLTF loaded by three.js using threlte
				{/if}
			</div>
			<div class="grid grid-cols-3" bind:this={content2} />
		</div>
	</div>
</section>
