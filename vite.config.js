import { defineConfig } from 'vite'

export default defineConfig({
  base: '/fastforward/', // ✅ သင့် repo name က "fastforward"
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})