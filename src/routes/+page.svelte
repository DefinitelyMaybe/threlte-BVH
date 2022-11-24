<script>
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/Scene1.svelte';
	import { World, Debug } from '@threlte/rapier';
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
