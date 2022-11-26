<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene1.svelte';
	import { World, Debug } from '@threlte/rapier';
	import Inventory from '$lib/Inventory.svelte';
	import '../app.css';
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
		<Inventory />
	</div>
</div>
