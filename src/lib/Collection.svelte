<script lang="ts">
	import type { InventoryObject } from './types';
	import Item from './Item.svelte';

	export let objects: InventoryObject[] = [];

	// use intersection observer for showing and hiding
	const shownObjects: InventoryObject[] = [];
</script>

<div class="my-4">
	<slot name="title"><h1>Collection</h1></slot>
	<slot name="description"><span>Description</span></slot>
	<slot name="objects">
		<ul class="grid grid-cols-3">
			{#each objects as obj}
				<li class="overflow-x-hidden">
					<Item {...obj} />
				</li>
			{/each}
		</ul>
	</slot>
</div>
