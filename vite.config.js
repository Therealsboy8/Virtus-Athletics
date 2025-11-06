import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        shop: './shop.html',
        cart: './cart.html',
        community: './community.html',
        dashboard: './dashboard.html',
        auth: './auth.html'
      }
    }
  }
})
