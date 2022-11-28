<script lang="ts">
	import * as THREE from 'three';
	import type { InventoryObject } from './types';
	import Collection from './Collection.svelte';
	import Item from './Item.svelte';

	const shownObjects: InventoryObject[] = [];

	for (const key in THREE) {
		const geoMatcher = key.match(/Geometry/g);
		if (geoMatcher) {
			const bufMatcher = key.match(/Buffer/g);
			if (!bufMatcher) {
				// TODO-DefinitelyMaybe: these are all of the three.js geometries to use
				shownObjects.push({ name: key });
			}
		}
	}
</script>

<Collection>
	<h1 slot="title">THREE</h1>
	<span slot="description">Basic shapes from Three.js</span>
	<ul slot="objects" class="grid grid-cols-3">
		{#each shownObjects as obj}
			<li>
				<Item {...obj} />
			</li>
		{/each}
	</ul>
</Collection>
