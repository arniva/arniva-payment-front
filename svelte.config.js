import adapter from '@sveltejs/adapter-node';
// import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@modules': './src/lib/elements/modules',
			'@components': './src/lib/components',
			'@styles': './src/lib/styles/app.scss',
			'@api': './src/lib/core/api',
			'@models': './src/lib/core/models',
			'@functions': './src/lib/core/functions',
			'@helpers': './src/lib/core/helpers'
		}
	}
};

export default config;
