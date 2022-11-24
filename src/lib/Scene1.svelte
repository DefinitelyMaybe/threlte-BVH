<script lang="ts">
	// import Stats from 'stats.js';
	// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
	// could use tweakpane instead
	import * as THREE from 'three';
	import { OrbitControls, T, useThrelte } from '@threlte/core';
	import Dungeon from './Dungeon.svelte';
	import Player from './Player1.svelte';

	const { scene } = useThrelte();

	const params = {
		firstPerson: false,
		gravity: -30,
		playerSpeed: 10,
		physicsSteps: 5
		// reset: reset
	};

	const bgColor = 0x263238 / 2;
	const PI_2 = Math.PI / 2;

	scene.fog = new THREE.Fog(bgColor, 20, 70);
</script>

<T.PerspectiveCamera makeDefault position={[10, 10, -10]} fov={75} near={0.01} far={1000}>
	<!-- minDistance={1} maxDistance={20} -->
	<OrbitControls maxPolarAngle={PI_2} target={{ y: 0.5 }} />
</T.PerspectiveCamera>

<!-- shadow={{ camera: {left:-30, bottom:-30, top:30, right: 45}, mapSize: new THREE.Vector2(2048, 2048), bias: -1e-4, normalBias: 0.05,  }} -->
<T.DirectionalLight castShadow position={[50, 75, 50]} />
<T.HemisphereLight args={[0xffffff, 0x223344, 0.4]} />
<T.AmbientLight intensity={0.8} />

<Player />

<Dungeon />
