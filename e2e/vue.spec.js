/*
 * Tests end-to-end: abren la web en un navegador real
 * y la recorren como lo haría una persona usuaria.
 */
import { test, expect } from '@playwright/test'

test('la página de inicio muestra cabecera, contenido y pie', async ({ page }) => {
  await page.goto('/')

  /* banner = <header> de la página; contentinfo = <footer> de la página */
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.locator('main h1')).toHaveText('Inicio')
  await expect(page.getByRole('contentinfo')).toBeVisible()
})

test('navega al catálogo desde el menú principal', async ({ page }) => {
  await page.goto('/')

  /* Busca el enlace "Catálogo" dentro del menú de escritorio y lo pulsa */
  await page
    .getByRole('navigation', { name: 'Navegación principal', exact: true })
    .getByRole('link', { name: 'Catálogo' })
    .click()

  await expect(page).toHaveURL(/\/catalogo$/)
  await expect(page.locator('main h1')).toHaveText('Catálogo')
})