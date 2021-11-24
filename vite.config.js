import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

import cesium from 'vite-plugin-cesium';
export default defineConfig({
  plugins: [vue(),cesium()]
});