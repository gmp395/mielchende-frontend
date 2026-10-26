<script setup>
/*
 * Captcha de Cloudflare Turnstile.
 * Carga el script de Cloudflare, pinta el reto dentro de un div y, cuando
 * la persona lo supera, guarda el token en el v-model del componente padre.
 * El token solo demuestra que lo ha superado: quien lo comprueba de verdad
 * es el backend, con la clave secreta.
 * Cada token sirve una sola vez: tras enviar el formulario, el padre llama
 * a reset() para pedir uno nuevo.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

/* render=explicit: el reto no se pinta solo; lo pintamos nosotros con render() */
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/* Clave pública del sitio, definida en el archivo .env */
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

/* Token del captcha, compartido con el padre por v-model ('' mientras no hay token) */
const token = defineModel({ type: String, default: '' })

/* Div donde Cloudflare pinta el reto */
const container = ref(null)

/* true si no se pudo cargar el captcha (sin conexión, bloqueador...) */
const loadError = ref(false)

/* Identificador que devuelve Cloudflare al pintar el reto; lo necesitan reset y remove */
let widgetId = null

/*
 * Carga el script de Cloudflare una sola vez en toda la web.
 * Si ya se cargó (window.turnstile existe), no hace nada.
 * Si otro captcha lo está cargando, espera a que termine en lugar de añadirlo dos veces.
 */
function loadScript() {
  if (window.turnstile) return Promise.resolve()

  const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)
  const script = existing ?? document.createElement('script')

  const loaded = new Promise((resolve, reject) => {
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
  })

  if (!existing) {
    script.src = SCRIPT_URL
    script.async = true
    document.head.appendChild(script)
  }
  return loaded
}

/* Al montarse: carga el script y pinta el reto en el div */
onMounted(async () => {
  try {
    await loadScript()

    /* Si el componente ya se desmontó mientras cargaba el script, no pintamos nada */
    if (!container.value) return

    widgetId = window.turnstile.render(container.value, {
      sitekey: SITE_KEY,
      language: 'es',
      /* Tema claro siempre, a juego con el diseño de la web
         (por defecto imitaría el modo oscuro del sistema operativo) */
      theme: 'light',
      /* Reto superado: guardamos el token */
      callback: (newToken) => {
        token.value = newToken
      },
      /* El token caduca a los pocos minutos: lo vaciamos para no enviar uno inválido */
      'expired-callback': () => {
        token.value = ''
      },
      'error-callback': () => {
        token.value = ''
      },
    })
  } catch {
    loadError.value = true
  }
})

/* Al desmontarse: quitamos el reto para no dejarlo colgado en la página */
onBeforeUnmount(() => {
  if (widgetId !== null) window.turnstile?.remove(widgetId)
})

/* Pide un reto nuevo; lo usa el padre después de cada envío */
function reset() {
  token.value = ''
  if (widgetId !== null) window.turnstile?.reset(widgetId)
}

/* defineExpose: hace que el padre pueda llamar a reset() a través de una ref */
defineExpose({ reset })
</script>

<template>
  <div>
    <div ref="container"></div>
    <p v-if="loadError" role="alert" class="mt-2 text-sm text-destructive">
      No se ha podido cargar la verificación. Recarga la página e inténtalo de nuevo.
    </p>
  </div>
</template>