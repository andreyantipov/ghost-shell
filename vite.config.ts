import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  root: './example',
  plugins: [tsconfigPaths()],
  // Set base path for GitHub Pages (replace 'ghost-shell' with your repo name)
  base: process.env.GITHUB_PAGES ? '/ghost-shell/' : '/',
})