/*
 * Tests de la página de inicio: portada, rasgos de la miel y enlaces al catálogo.
 * La vista es estática, pero usa RouterLink, así que se monta con el router real.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import router from '@/router'

let pinia
let wrapper

async function mountHome() {
  await router.push('/')
  await router.isReady()
  wrapper = mount(HomeView, { global: { plugins: [pinia, router] } })
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

describe('HomeView', () => {
  it('muestra el título y la foto de portada', async () => {
    await mountHome()

    expect(wrapper.find('h1').text()).toBe('Miel cruda de Terras do Miño')
    expect(wrapper.find('img').attributes('src')).toBe('/images/banners/apicultor-ahumador.jpg')
  })

  it('muestra los tres rasgos de la miel', async () => {
    await mountHome()

    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.text()).toContain('Cruda y sin filtrar')
  })

  it('los botones llevan al catálogo', async () => {
    await mountHome()

    const links = wrapper.findAll('a[href="/catalogo"]')
    expect(links).toHaveLength(2)
  })
})