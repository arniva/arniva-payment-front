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
			'@views': fileURLToPath(new URL('./src/lib/core/views', import.meta.url)),
			// Add alias for @ruzgardogu/utils CSS
			'@ruzgardogu/utils/styles': fileURLToPath(new URL('./node_modules/@ruzgardogu/utils/dist/styles/app.css', import.meta.url))
		}
	},
	optimizeDeps: {
		include: ['@ruzgardogu/utils']
	},
	ssr: {
		noExternal: ['@ruzgardogu/utils']
	},
	build: {
		rollupOptions: {
			external: (id) => {
				// Don't externalize CSS imports from @ruzgardogu/utils
				if (id.includes('@ruzgardogu/utils') && id.includes('.css')) {
					return false;
				}
				return false;
			}
		}
	}
});
