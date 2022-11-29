import { writable } from 'svelte/store';

export const scenes = writable([] as THREE.Scene[]);
