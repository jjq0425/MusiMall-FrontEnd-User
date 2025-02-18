import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  base: '/MusiMall-FrontEnd-User/',
  plugins: [vue()],
  server: {
    port: 22335
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

})
