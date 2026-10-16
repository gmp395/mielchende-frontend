/*
 * Tests de la página de contacto: correo, mapa, redes sociales y enlace al catálogo.
 * Los datos salen de constants/contact.js, así que el test los usa en vez de repetirlos.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ContactView from '@/views/ContactView.vue'
import router from '@/router'
import { CONTACT_EMAIL, MAPS_URL, SOCIAL_LINKS } from '@/constants/contact'

let pinia
let wrapper

async function mountContact() {
  await router.push('/contacto')
  await router.isReady()
  wrapper = mount(ContactView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('ContactView', () => {
  it('muestra el correo como enlace mailto', async () => {
    await mountContact()

    const mail = wrapper.find(`a[href="mailto:${CONTACT_EMAIL}"]`)
    expect(mail.exists()).toBe(true)
    expect(mail.text()).toBe(CONTACT_EMAIL)
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