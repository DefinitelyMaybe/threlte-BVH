<script lang="ts">
	// import * as THREE from 'three';
	import { T, Three, useThrelte, Object3DInstance } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { AutoColliders } from '@threlte/rapier';

	const { gltf } = useGltf('/dungeon.glb');

	$: dungeonModel = $gltf?.scene;
</script>

{#if dungeonModel}
	<AutoColliders shape={'cuboid'}>
		<Object3DInstance
			object={dungeonModel}
			receiveShadow
			castShadow
			scale={0.01}
			position={{ x: -22.5, z: 30 }}
		/>
	</AutoColliders>
{/if}
