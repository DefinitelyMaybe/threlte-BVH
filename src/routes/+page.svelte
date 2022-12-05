<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene1.svelte';
	import { World, Debug } from '@threlte/rapier';
	import Inventory from '$lib/Inventory.svelte';
	import '../app.css';

	let showInventory = false;
</script>

<div class="w-full h-full">
	<Canvas>
		<World>
			<Debug />
			<Scene />
		</World>
	</Canvas>
</div>
<div class="absolute z-10 top-0 w-full h-full pointer-events-none">
	<div class="relative w-full h-full">
		<button
			class="pointer-events-auto flex"
			on:click={() => {
				showInventory = !showInventory;
				console.log(showInventory);
			}}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
			<p class="px-4">Objects</p>
		</button>
		<Inventory bind:show={showInventory} />
	</div>
</div>
