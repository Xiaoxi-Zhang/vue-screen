import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import qiankun from 'vite-plugin-qiankun'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 第一个参数：子应用的名字。需要跟主应用配置的名字保持一致
    qiankun('BigScreen', {
      useDevMode: true
    })
  ],
  server: {
    // 防止开发阶段的assets 静态资源加载问题
    // 不配置origin，加载静态资源的时候默认是以主应用的地址来加载 http://localhost:8081/assets/building-icon.png
    origin: '//localhost:5173'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
