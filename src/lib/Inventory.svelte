<script lang="ts">
	import type { InventoryObject } from './types';
	import * as THREE from 'three';
	const shownObjects: InventoryObject[] = [];

	// show objects with inventory
	// start with base objects from Three.js
	// then request new objects by url

	// have a selected object
	for (const key in THREE) {
		const geoMatcher = key.match(/Geometry/g);
		if (geoMatcher) {
			const bufMatcher = key.match(/Buffer/g);
			if (!bufMatcher) {
				// TODO-DefinitelyMaybe: these are all of the three.js geometries to use
				console.log(key);
			}
		}
	}
</script>

<section>
	<ul>
		{#each shownObjects as obj}
			<li>obj.name</li>
		{/each}
	</ul>
	hello world
</section>
