import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { resolve } from "path";
const pathSrc = resolve(__dirname, "src");




// https://vite.dev/config/
export default defineConfig({
  base: '/MusiMall-FrontEnd-User/',
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(pathSrc, "assets/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),

  ],
  server: {
    port: 22335
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

})
