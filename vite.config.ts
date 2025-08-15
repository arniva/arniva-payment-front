import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@styles': fileURLToPath(new URL('./src/lib/styles/app.scss', import.meta.url)),
			'@components': fileURLToPath(new URL('./src/lib/elements/components', import.meta.url)),
			'@modules': fileURLToPath(new URL('./src/lib/elements/modules', import.meta.url)),
			'@api': fileURLToPath(new URL('./src/lib/core/api', import.meta.url)),
			'@helpers': fileURLToPath(new URL('./src/lib/core/helpers', import.meta.url)),
			'@models': fileURLToPath(new URL('./src/lib/core/models', import.meta.url)),
			'@views': fileURLToPath(new URL('./src/lib/core/views', import.meta.url))
		}
	},
	optimizeDeps: {
		include: ['@ruzgardogu/ui']
	}
});
