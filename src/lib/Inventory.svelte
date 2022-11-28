<script lang="ts">
	import ThreeCollection from './ThreeBasics.svelte';
	import GLTFCollection from './GLTF.svelte';

	// show objects with inventory
	// start with base objects from Three.js
	// then request new objects by url/local

	// have a selected object
	let selected;

	// TODO-DefinitelyMaybe: Static asset ts support / auto-completion
	// so that you can know the objects you can get
	// and know that the values you've passed are correct
</script>

<section class="bg-gray-300/50 pointer-events-auto overflow-y-scroll h-full">
	<ThreeCollection />
	<GLTFCollection url={'dungeon.glb'} />
</section>
