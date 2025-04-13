import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
	base: './', // 关键配置：使用相对路径
	plugins: [vue()],
	server: {
		port: 38082
	},
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			}
		}
	}
})
