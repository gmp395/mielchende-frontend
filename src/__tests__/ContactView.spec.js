/*
 * Tests de la página de contacto: formulario (validación, envío, errores),
 * que no muestre el correo del negocio, mapa, redes y enlace al catálogo.
 * El repositorio se sustituye por un mock (no se llama al backend) y el captcha
 * por un componente falso que entrega un token al montarse (no se carga Cloudflare).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ContactView from '@/views/ContactView.vue'
import router from '@/router'
import { contactRepository } from '@/api/contactRepository'
import { ApiError } from '@/api/httpClient'
import { MAPS_URL, SOCIAL_LINKS } from '@/constants/contact'

vi.mock('@/api/contactRepository', () => ({
  contactRepository: { send: vi.fn() },
}))

/* Captcha falso: entrega un token al montarse y registra cuántas veces se reinicia */
const captchaReset = vi.fn()
const CaptchaStub = {
  emits: ['update:modelValue'],
  template: '<div data-test="captcha"></div>',
  mounted() {
    this.$emit('update:modelValue', 'token-de-prueba')
  },
  methods: { reset: captchaReset },
}

let pinia
let wrapper

async function mountContact() {
  await router.push('/contacto')
  await router.isReady()
  wrapper = mount(ContactView, {
    global: { plugins: [pinia, router], stubs: { CaptchaWidget: CaptchaStub } },
  })
  await flushPromises()
  return wrapper
}

/* Rellena el formulario con datos válidos */
async function fillForm() {
  await wrapper.find('#contact-name').setValue('Ana')
  await wrapper.find('#contact-email').setValue('ana@test.com')
  await wrapper.find('#contact-message').setValue('¿Tenéis miel de castaño?')
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('ContactView', () => {
  it('no muestra ningún correo electrónico ni enlace mailto', async () => {
    await mountContact()

    expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('@')
  })

  it('valida los campos antes de enviar', async () => {
    await mountContact()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Introduce tu nombre.')
    expect(wrapper.text()).toContain('Introduce tu email.')
    expect(wrapper.text()).toContain('Escribe tu mensaje.')
    expect(contactRepository.send).not.toHaveBeenCalled()
  })

  it('envía el mensaje con el token del captcha y vacía el formulario', async () => {
    contactRepository.send.mockResolvedValue(null)
    await mountContact()
    await fillForm()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(contactRepository.send).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@test.com',
      message: '¿Tenéis miel de castaño?',
      captchaToken: 'token-de-prueba',
    })
    expect(wrapper.find('[role="status"]').text()).toContain('Gracias por escribirnos')
    expect(wrapper.find('#contact-name').element.value).toBe('')
    /* El token ya se ha usado: se pide un reto nuevo */
    expect(captchaReset).toHaveBeenCalled()
  })

  it('muestra el error del servidor y pide un captcha nuevo', async () => {
    contactRepository.send.mockRejectedValue(
      new ApiError(400, 'No se ha podido verificar que no eres un robot'),
    )
    await mountContact()
    await fillForm()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No se ha podido verificar que no eres un robot',
    )
    /* Los datos se conservan para poder reintentar */
    expect(wrapper.find('#contact-name').element.value).toBe('Ana')
    expect(captchaReset).toHaveBeenCalled()
  })

  it('informa de que los datos solo se usan para atender la consulta', async () => {
    await mountContact()

    expect(wrapper.text()).toContain('Solo utilizaremos tus datos para atender tu consulta.')
  })

  it('el mapa y las redes se abren en otra pestaña de forma segura', async () => {
    await mountContact()

    const externalLinks = [MAPS_URL, ...SOCIAL_LINKS.map((link) => link.url)]
    for (const url of externalLinks) {
      const link = wrapper.find(`a[href="${url}"]`)
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
    }
  })

  it('cada red social tiene un nombre accesible', async () => {
    await mountContact()

    for (const social of SOCIAL_LINKS) {
      expect(wrapper.find(`a[aria-label="${social.label}"]`).exists()).toBe(true)
    }
  })

  it('enlaza con el catálogo para hacer una solicitud', async () => {
    await mountContact()

    expect(wrapper.find('a[href="/catalogo"]').exists()).toBe(true)
  })
})