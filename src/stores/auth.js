/*
 * Store de autenticación (Pinia, sintaxis setup):
 * ref() → State, computed() → Getters, function() → Actions.
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authRepository } from '@/api/authRepository'
import { decodeJwt, isTokenExpired } from '@/utils/jwt'

/* Clave con la que guardamos el token en localStorage */
const TOKEN_STORAGE_KEY = 'mielchende_token'

/*
 * Lectura y escritura protegidas con try/catch: en algunos navegadores
 * o modos privados localStorage puede no estar disponible.
 */
function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
    else localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    /* Sin localStorage la sesión solo dura hasta recargar la página */
  }
}

export const useAuthStore = defineStore('auth', () => {
  /* State: el token es la única fuente de verdad de la sesión */
  const token = ref(readStoredToken())

  /* Getters: todo lo demás se deriva del token */
  const payload = computed(() => decodeJwt(token.value))
  const isAuthenticated = computed(() => !!payload.value && !isTokenExpired(payload.value))
  const email = computed(() => (isAuthenticated.value ? payload.value.sub : null))
  const roles = computed(() => (isAuthenticated.value ? (payload.value.roles ?? []) : []))
  const isAdmin = computed(() => roles.value.includes('ROLE_ADMIN'))

  /* Actions */
  function setToken(newToken) {
    token.value = newToken
    writeStoredToken(newToken)
  }

  async function login(userEmail, password) {
    const response = await authRepository.login(userEmail, password)
    setToken(response.token)
  }

  /*
   * Tras registrarse, iniciamos sesión automáticamente
   * para que el cliente no tenga que volver a escribir sus datos.
   */
  async function register(name, userEmail, password) {
    await authRepository.register(name, userEmail, password)
    await login(userEmail, password)
  }

  function logout() {
    setToken(null)
  }

  return { token, isAuthenticated, email, roles, isAdmin, login, register, logout }
})