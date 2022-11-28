<script lang="ts">
	import type { InventoryObject } from './types';
	import Collection from './Collection.svelte';
	import { useGltf } from '@threlte/extras';

	export let url: string;
	let author = 'unknown';
	let authorURL = '';
	let license = 'unknown';
	let licenseURL = '';

	const { gltf } = useGltf(url);
	const objects: InventoryObject[] = [];

	$: if ($gltf) {
		let x = $gltf?.asset.extras.author.split(' ');
		author = x[0];
		authorURL = x[1].slice(1, -1);

		x = $gltf?.asset.extras.license.split(' ');
		license = x[0];
		licenseURL = x[1].slice(1, -1);

		for (const key in $gltf.nodes) {
			objects.push({ name: key });
		}
	}
</script>

<Collection {objects}>
	<h1 slot="title">{$gltf?.asset.extras.title ?? 'GLTF'}</h1>
	<div slot="description">
		{#if $gltf}
			<a href={authorURL}>{author}</a>
			<a href={$gltf?.asset.extras.source}>source</a>
			<a href={licenseURL}>{license}</a>
		{:else}
			A GLTF loaded by three.js using threlte
		{/if}
	</div>
</Collection>
