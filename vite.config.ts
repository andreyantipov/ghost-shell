import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './demo',
  plugins: [tsconfigPaths()],
  base: process.env.GITHUB_PAGES ? '/ghost-shell/' : '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
})