/*
 * Tests del componente CaptchaWidget (Cloudflare Turnstile).
 * No se carga el script real de Cloudflare: se simula el objeto window.turnstile
 * que ese script crea, con funciones mock (vi.fn). Así comprobamos cómo usa
 * el componente la API de Cloudflare sin depender de internet.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CaptchaWidget from '@/components/common/CaptchaWidget.vue'

/* Dirección del script, la misma que usa el componente */
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/* Opciones que el componente pasó a turnstile.render() (callbacks incluidos) */
let renderOptions

/*
 * Versión falsa de la API de Cloudflare.
 * render guarda las opciones recibidas y devuelve un identificador de reto.
 */
function fakeTurnstile() {
  return {
    render: vi.fn((container, options) => {
      renderOptions = options
      return 'widget-1'
    }),
    reset: vi.fn(),
    remove: vi.fn(),
  }
}

let wrapper

/* Monta el componente y espera a que termine onMounted (que es asíncrono) */
async function mountWidget() {
  wrapper = mount(CaptchaWidget, { props: { modelValue: '' } })
  await flushPromises()
  return wrapper
}

/* Último valor que el componente ha emitido por v-model */
function lastToken() {
  const emitted = wrapper.emitted('update:modelValue')
  return emitted?.at(-1)[0]
}

beforeEach(() => {
  renderOptions = undefined
})

/* Limpieza: ni API falsa ni etiquetas <script> de un test a otro */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  delete window.turnstile
  document.querySelectorAll(`script[src="${SCRIPT_URL}"]`).forEach((script) => script.remove())
})

describe('CaptchaWidget', () => {
  it('pinta el reto en español, en tema claro y con la clave del sitio', async () => {
    window.turnstile = fakeTurnstile()
    await mountWidget()

    expect(window.turnstile.render).toHaveBeenCalledOnce()
    expect(renderOptions.language).toBe('es')
    expect(renderOptions.theme).toBe('light')
    expect(renderOptions.sitekey).toBe(import.meta.env.VITE_TURNSTILE_SITE_KEY)
  })

  it('al superar el reto entrega el token por v-model', async () => {
    window.turnstile = fakeTurnstile()
    await mountWidget()

    /* Simulamos que Cloudflare llama al callback con un token */
    renderOptions.callback('token-de-cloudflare')

    expect(lastToken()).toBe('token-de-cloudflare')
  })

  it('si el token caduca o hay un error, lo vacía', async () => {
    window.turnstile = fakeTurnstile()
    await mountWidget()

    renderOptions.callback('token-de-cloudflare')
    renderOptions['expired-callback']()
    expect(lastToken()).toBe('')

    renderOptions.callback('otro-token')
    renderOptions['error-callback']()
    expect(lastToken()).toBe('')
  })

  it('reset() vacía el token y pide a Cloudflare un reto nuevo', async () => {
    window.turnstile = fakeTurnstile()
    await mountWidget()
    renderOptions.callback('token-ya-usado')

    wrapper.vm.reset()

    expect(lastToken()).toBe('')
    expect(window.turnstile.reset).toHaveBeenCalledWith('widget-1')
  })

  it('al desmontarse quita el reto de la página', async () => {
    window.turnstile = fakeTurnstile()
    await mountWidget()

    wrapper.unmount()
    wrapper = undefined

    expect(window.turnstile.remove).toHaveBeenCalledWith('widget-1')
  })

  it('si el script todavía no está cargado, lo añade y pinta el reto al terminar de cargar', async () => {
    /* Sin window.turnstile: el componente tiene que cargar el script */
    wrapper = mount(CaptchaWidget, { props: { modelValue: '' } })

    const script = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    expect(script).not.toBeNull()

    /* Simulamos que el script termina de cargar y crea la API */
    window.turnstile = fakeTurnstile()
    script.dispatchEvent(new Event('load'))
    await flushPromises()

    expect(window.turnstile.render).toHaveBeenCalledOnce()
  })

  it('si el script no se puede cargar, muestra un aviso', async () => {
    wrapper = mount(CaptchaWidget, { props: { modelValue: '' } })

    /* Simulamos un fallo de red al cargar el script */
    const script = document.querySelector(`script[src="${SCRIPT_URL}"]`)
    script.dispatchEvent(new Event('error'))
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toContain(
      'No se ha podido cargar la verificación',
    )
  })
})