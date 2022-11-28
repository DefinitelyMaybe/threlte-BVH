<script lang="ts">
	import type { InventoryObject } from './types';
	import Collection from './Collection.svelte';
	import Item from './Item.svelte';
	import { useGltf } from '@threlte/extras';
	import { Canvas, OrbitControls, T, useThrelte } from '@threlte/core';
	import { degToRad } from 'three/src/math/MathUtils';
	// import {  } from "@threlte/extras";

	export let url: string;

	let author = 'unknown';
	let authorURL = '';
	let license = 'unknown';
	let licenseURL = '';

	const { gltf } = useGltf(url);
	let objects: InventoryObject[] = [];
	let shownObjects: InventoryObject[] = [];

	$: if ($gltf) {
		let x = $gltf?.asset.extras.author.split(' ');
		author = x[0];
		authorURL = x[1].slice(1, -1);

		x = $gltf?.asset.extras.license.split(' ');
		license = x[0];
		licenseURL = x[1].slice(1, -1);

		// TODO-DefinitelyMaybe: I wanna start with getting all the unquie geometry
		for (const key in $gltf.nodes) {
			objects.push({ name: key });
		}
		objects = objects;

		shownObjects = objects.slice(0, 10);
	}
</script>

<Collection>
	<h1 slot="title">{$gltf?.asset.extras.title ?? 'GLTF'}</h1>
	<div slot="description" class="flex flex-col">
		{#if $gltf}
			<a href={authorURL}>{author}</a>
			<div>
				<a href={$gltf?.asset.extras.source}>source</a> -
				<a href={licenseURL}>{license}</a>
			</div>
		{:else}
			A GLTF loaded by three.js using threlte
		{/if}
	</div>
	<ul slot="objects" class="grid grid-cols-3">
		{#each shownObjects as obj}
			<li>
				<div class="relative bg-black/50">
					{obj.name}
					<!-- <Canvas>
						<T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={24}>
							<OrbitControls maxPolarAngle={degToRad(80)} enableZoom={false} target={{ y: 0.5 }} />
						</T.PerspectiveCamera>

						<T.DirectionalLight castShadow position={[3, 10, 10]} />
						<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
						<T.AmbientLight intensity={0.2} />

						<T.Group>
							<T.Mesh position.y={0.5} castShadow>
								<T.BoxGeometry />
								<T.MeshStandardMaterial color="#333333" />
							</T.Mesh>
						</T.Group>

						<T.Mesh receiveShadow rotation.x={degToRad(-90)}>
							<T.CircleGeometry args={[3, 72]} />
							<T.MeshStandardMaterial color="white" />
						</T.Mesh>
					</Canvas> -->
				</div>
				<!-- <Item {...obj} /> -->
			</li>
		{/each}
	</ul>
</Collection>
