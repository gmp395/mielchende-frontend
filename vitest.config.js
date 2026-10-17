import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      /* Archivo que se ejecuta antes de los tests (simula lo que jsdom no tiene) */
      setupFiles: ['./vitest.setup.js'],
      /*
        Cobertura de los tests: mide qué líneas del código se ejecutan
        cuando pasan los tests, como JaCoCo en el backend.
        Solo se calcula al ejecutar con la opción --coverage.
      */
      coverage: {
        /* Proveedor que mide la cobertura con el motor V8 (el de Chrome y Node) */
        provider: 'v8',
        /*
          text: resumen en la terminal.
          html: informe navegable en coverage/index.html.
        */
        reporter: ['text', 'html'],
        /*
          Archivos que se miden: todo el código de src, incluidos
          los que ningún test ejecuta, para que el porcentaje sea honesto.
        */
        include: ['src/**/*.{js,vue}'],
        /*
          Se excluyen los propios tests y main.js, que solo arranca
          la aplicación (como el main de MielchendeBackendApplication).
        */
        exclude: ['src/__tests__/**', 'src/main.js'],
      },
    },
  }),
)