import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

// import "npm:svelte"
// import "npm:@sveltejs/kit"

const config: UserConfig = {
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['three', 'troika-three-text']
	}
};

export default config;
