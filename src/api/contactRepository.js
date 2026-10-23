/*
 * Repositorio del formulario de contacto: única pieza que conoce
 * el endpoint público /api/contact del backend.
 */
import { httpClient } from '@/api/httpClient'

export const contactRepository = {
  /*
   * POST /contact → 201 sin cuerpo.
   * message: { name, email, message, captchaToken }
   */
  send(message) {
    return httpClient.post('/contact', message)
  },
}