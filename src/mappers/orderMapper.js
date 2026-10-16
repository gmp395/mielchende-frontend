/*
 * Mapper de solicitudes: traduce entre los datos del formulario
 * y el formato (DTO) que espera la API.
 * Si el backend cambiara un nombre de campo, solo habría que tocar este archivo.
 */
export const orderMapper = {
  /*
   * Formulario → CreateOrderDto del backend:
   * { items: [{ productId, quantity }], phone, comments }.
   * Los campos opcionales vacíos se envían como null, no como texto vacío.
   */
  toCreateDto(lines, contact) {
    const phone = contact.phone.trim()
    const comments = contact.comments.trim()
    return {
      items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
      phone: phone || null,
      comments: comments || null,
    }
  },
}