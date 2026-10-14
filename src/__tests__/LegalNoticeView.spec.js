/*
 * Tests de la página de aviso legal.
 * Es contenido estático: comprobamos que muestra los datos del titular
 * (tomados de las constantes) y el aviso de texto provisional.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LegalNoticeView from '@/views/LegalNoticeView.vue'
import { CONTACT_EMAIL } from '@/constants/contact'
import { LEGAL_INFO } from '@/constants/legal'

describe('LegalNoticeView', () => {
  it('muestra el título y los datos identificativos del titular', () => {
    const wrapper = mount(LegalNoticeView)
    const text = wrapper.text()

    expect(wrapper.find('h1').text()).toBe('Aviso legal')
    expect(text).toContain(LEGAL_INFO.ownerName)
    expect(text).toContain(LEGAL_INFO.taxId)
    expect(text).toContain(LEGAL_INFO.address)
    expect(text).toContain(CONTACT_EMAIL)
  })

  it('avisa de que el texto es provisional mientras los datos sean de ejemplo', () => {
    const wrapper = mount(LegalNoticeView)

    expect(wrapper.find('[role="note"]').text()).toContain('Texto provisional')
  })
})