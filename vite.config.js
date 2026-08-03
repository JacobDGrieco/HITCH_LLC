import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
