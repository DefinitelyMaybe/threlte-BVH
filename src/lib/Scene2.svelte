<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls, T, useThrelte } from '@threlte/core';
	import { degToRad } from 'three/src/math/MathUtils';
	import { scenes } from './Stores1';

	const { scene, renderer } = useThrelte();

	const geometries = [
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.SphereGeometry(0.5, 12, 8),
		new THREE.DodecahedronGeometry(0.5),
		new THREE.CylinderGeometry(0.5, 0.5, 1, 12)
	];

	$scenes = [];

	for (let i = 0; i < 10; i++) {
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
		camera.position.z = 2;
		scene.userData.camera = camera;

		// const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
		// controls.minDistance = 2;
		// controls.maxDistance = 5;
		// controls.enablePan = false;
		// controls.enableZoom = false;
		// scene.userData.controls = controls;

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

		$scenes.push(scene);
	}

	// function animate() {
	// 	render();
	// 	requestAnimationFrame(animate);
	// }

	// function render() {
	// 	updateSize();

	// 	canvas.style.transform = `translateY(${window.scrollY}px)`;

	// 	renderer.setClearColor(0xffffff);
	// 	renderer.setScissorTest(false);
	// 	renderer.clear();

	// 	renderer.setClearColor(0xe0e0e0);
	// 	renderer.setScissorTest(true);

	// 	scenes.forEach(function (scene) {
	// 		// so something moves
	// 		scene.children[0].rotation.y = Date.now() * 0.001;

	// 		// get the element that is a place holder for where we want to
	// 		// draw the scene
	// 		const element = scene.userData.element;

	// 		// get its position relative to the page's viewport
	// 		const rect = element.getBoundingClientRect();

	// 		// check if it's offscreen. If so skip it
	// 		if (
	// 			rect.bottom < 0 ||
	// 			rect.top > renderer.domElement.clientHeight ||
	// 			rect.right < 0 ||
	// 			rect.left > renderer.domElement.clientWidth
	// 		) {
	// 			return; // it's off screen
	// 		}

	// 		// set the viewport
	// 		const width = rect.right - rect.left;
	// 		const height = rect.bottom - rect.top;
	// 		const left = rect.left;
	// 		const bottom = renderer.domElement.clientHeight - rect.bottom;

	// 		renderer.setViewport(left, bottom, width, height);
	// 		renderer.setScissor(left, bottom, width, height);

	// 		const camera = scene.userData.camera;

	// 		//camera.aspect = width / height; // not changing in this example
	// 		//camera.updateProjectionMatrix();

	// 		//scene.userData.controls.update();

	// 		renderer.render(scene, camera);
	// 	});
	// }
</script>

<T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={24}>
	<OrbitControls maxPolarAngle={degToRad(80)} enableZoom={false} target={{ y: 0.5 }} />
</T.PerspectiveCamera>

<T.DirectionalLight castShadow position={[3, 10, 10]} />
<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
<T.AmbientLight intensity={0.2} />

<T.Group>
	<T.Mesh position.y={0.5} castShadow let:ref>
		<T.BoxGeometry />
		<T.MeshStandardMaterial color="#333333" />
	</T.Mesh>
</T.Group>

<T.Mesh receiveShadow rotation.x={degToRad(-90)}>
	<T.CircleGeometry args={[3, 72]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
