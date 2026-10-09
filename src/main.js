/*
 * Punto de entrada de la aplicación.
 * Carga los estilos globales, crea la app de Vue
 * y registra Pinia (estado global) y Vue Router (navegación).
 */
import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')