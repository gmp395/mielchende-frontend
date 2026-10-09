/*
 * Configuración de Vite (servidor de desarrollo y build).
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
/* Plugin oficial de Tailwind CSS 4 para Vite */
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  /*
   * Plugins: Vue (archivos .vue), las DevTools de Vue
   * y Tailwind (genera el CSS a partir de las clases que usemos).
   */
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    /* Alias "@" para importar desde src sin rutas relativas largas */
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})