// Configures the Vite dev/build pipeline, including the React/Tailwind plugins
// and a local proxy that lets the frontend call Vercel-style API routes.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite's dev server can encounter imported HTML assets; this turns those imports
// into stable public paths instead of trying to parse the HTML as JavaScript.
function htmlImportFallback() {
	return {
		name: 'html-import-fallback',
		apply: 'serve',
		enforce: 'pre',
		transform(source, id) {
			if (!id.endsWith('.html')) {
				return null;
			}

			return {
				code: `export default ${JSON.stringify(id.replace(/.*?([^/\\]+\.html)$/, '/$1'))};`,
				map: null,
			};
		},
	};
}

export default defineConfig({
	plugins: [htmlImportFallback(), react(), tailwindcss()],
	server: {
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
});
