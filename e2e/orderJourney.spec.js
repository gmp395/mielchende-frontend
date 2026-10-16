/*
 * Test end-to-end del recorrido principal del cliente, contra el backend real:
 * registro → catálogo → ficha → solicitud → Mis solicitudes.
 * Requisitos: Docker, el backend (puerto 8081) y el frontend (puerto 5173) en marcha.
 * Cada ejecución crea en la base de datos un usuario y una solicitud de prueba,
 * reconocibles por su email (e2e-...@test.com).
 */
import { test, expect } from '@playwright/test'

test('un cliente nuevo se registra, solicita un producto y lo ve en Mis solicitudes', async ({ page }) => {
  /* Email único en cada ejecución, para poder repetir el test sin usuarios duplicados */
  const email = `e2e-${Date.now()}@test.com`
  const password = 'e2e-password-123'

  /* 1. Registro: al crear la cuenta se inicia sesión y se vuelve al inicio */
  await page.goto('/registro')
  await page.getByLabel('Nombre', { exact: true }).fill('Cliente E2E')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Contraseña', { exact: true }).fill(password)
  await page.getByLabel('Repite la contraseña', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Crear cuenta' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('button', { name: 'Mi cuenta' })).toBeVisible()

  /* 2. Catálogo: abrimos el primer producto disponible */
  await page.goto('/catalogo')
  const availableCard = page
    .getByRole('main')
    .getByRole('listitem')
    .filter({ hasText: 'Disponible' })
    .first()
  await availableCard.getByRole('link').click()

  /* 3. Ficha: esperamos a que cargue y guardamos el nombre para comprobarlo al final */
  const requestLink = page.getByRole('link', { name: 'Solicitar este producto' })
  await expect(requestLink).toBeVisible()
  const productName = (await page.getByRole('main').locator('h1').textContent()).trim()
  await requestLink.click()

  /* 4. Solicitud: el producto llega preseleccionado; indicamos cantidad y comentario */
  await expect(page).toHaveURL(/\/solicitud\?producto=\d+/)
  await page.getByLabel('Cantidad', { exact: true }).fill('2')
  await page.getByLabel('Comentarios', { exact: true }).fill('Solicitud creada por el test E2E')
  await page.getByRole('button', { name: 'Enviar solicitud' }).click()

  /* 5. Confirmación: el modal aparece y lleva a Mis solicitudes */
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('Solicitud enviada')
  await dialog.getByRole('link', { name: 'Ver mis solicitudes' }).click()

  /* 6. Mis solicitudes: la nueva solicitud aparece la primera, en estado Recibido */
  await expect(page).toHaveURL(/\/mis-solicitudes$/)
  const latestOrder = page.getByRole('article').first()
  await expect(latestOrder).toContainText(productName)
  await expect(latestOrder).toContainText('× 2')
  await expect(latestOrder).toContainText('Solicitud creada por el test E2E')
  await expect(latestOrder.locator('[aria-current="step"]')).toContainText('Recibido')
})

test('un visitante sin sesión que intenta solicitar va al login', async ({ page }) => {
  await page.goto('/solicitud')

  /*
   * El guard lo lleva al login, recordando a dónde quería ir.
   * Vue Router no codifica la "/" dentro de la query: queda ?redirect=/solicitud
   */
  await expect(page).toHaveURL(/\/login\?redirect=\/solicitud$/)
  await expect(page.getByRole('main').locator('h1')).toHaveText('Iniciar sesión')
})