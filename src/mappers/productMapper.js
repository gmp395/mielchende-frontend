/*
 * Mapper de productos: traduce entre el formulario del panel
 * y el formato (DTO) de la API.
 * El formulario trabaja siempre con texto, que es lo que manejan los inputs;
 * el backend espera el precio como número y null en los opcionales vacíos.
 * Si el backend cambiara un nombre de campo, solo habría que tocar este archivo.
 */
import { PRODUCT_STATUS } from '@/constants/productStatus'

export const productMapper = {
  /*
   * Formulario vacío para crear un producto: disponible por defecto.
   * La categoría empieza vacía para obligar a elegirla conscientemente.
   */
  emptyForm() {
    return {
      name: '',
      description: '',
      format: '',
      price: '',
      imageUrl: '',
      seasonInfo: '',
      category: '',
      status: PRODUCT_STATUS.AVAILABLE,
    }
  },

  /*
   * Producto de la API → formulario (al editar).
   * El precio se muestra con dos decimales y coma: 8.5 → "8,50".
   * Los opcionales null pasan a texto vacío, porque un input no muestra null.
   */
  toForm(product) {
    return {
      name: product.name,
      description: product.description,
      format: product.format,
      price: Number(product.price).toFixed(2).replace('.', ','),
      imageUrl: product.imageUrl ?? '',
      seasonInfo: product.seasonInfo ?? '',
      category: product.category ?? '',
      status: product.status,
    }
  },

  /*
   * Formulario → ProductRequestDto del backend (al crear o editar).
   * Quita espacios, convierte el precio a número (admite coma o punto)
   * y envía null en los opcionales vacíos.
   */
  toRequestDto(form) {
    const imageUrl = form.imageUrl.trim()
    const seasonInfo = form.seasonInfo.trim()
    return {
      name: form.name.trim(),
      description: form.description.trim(),
      format: form.format.trim(),
      price: Number(form.price.trim().replace(',', '.')),
      imageUrl: imageUrl || null,
      seasonInfo: seasonInfo || null,
      category: form.category,
      status: form.status,
    }
  },
}