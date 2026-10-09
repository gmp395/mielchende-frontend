/*
 * Punto de entrada de la aplicación.
 * Carga los estilos globales, crea la app de Vue,
 * registra Pinia (estado global) y Vue Router (navegación)
 * y conecta el cliente HTTP con el store de autenticación.
 */
import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { configureHttpClient } from './api/httpClient'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

/*
 * Inyectamos en el cliente HTTP:
 *  - de dónde sacar el token (el store),
 *  - qué hacer ante un 401: cerrar sesión e ir al login,
 *    recordando la página en la que estaba para volver después.
 */
const authStore = useAuthStore()
configureHttpClient({
  getToken: () => authStore.token,
  onUnauthorized: () => {
    authStore.logout()
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  },
})

app.mount('#app')