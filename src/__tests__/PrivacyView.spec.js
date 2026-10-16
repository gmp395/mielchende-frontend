/*
 * Tests de la página de política de privacidad.
 * Es contenido estático: comprobamos los apartados clave del RGPD
 * (responsable, derechos y dónde reclamar).
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrivacyView from '@/views/PrivacyView.vue'
import { CONTACT_EMAIL } from '@/constants/contact'
import { LEGAL_INFO } from '@/constants/legal'

describe('PrivacyView', () => {
  it('identifica al responsable del tratamiento', () => {
    const wrapper = mount(PrivacyView)
    const text = wrapper.text()

    expect(wrapper.find('h1').text()).toBe('Política de privacidad')
    expect(text).toContain('Responsable del tratamiento')
    expect(text).toContain(LEGAL_INFO.ownerName)
    expect(text).toContain(CONTACT_EMAIL)
  })

  it('explica los derechos del usuario y dónde reclamar', () => {
    const wrapper = mount(PrivacyView)
    const text = wrapper.text()

    expect(text).toContain('Tus derechos')
    expect(text).toContain('Supresión')
    expect(text).toContain('Agencia Española de Protección de Datos')
  })
})