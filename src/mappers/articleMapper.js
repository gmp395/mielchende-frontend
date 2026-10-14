/*
 * Mapper de artículos: traduce entre el formulario del panel
 * y el formato (DTO) de la API.
 * El formulario trabaja siempre con texto; el backend espera null
 * en la imagen si se deja vacía.
 * El estado y las fechas no viajan en el formulario: los decide el backend.
 */
export const articleMapper = {
  /* Formulario vacío para crear un artículo */
  emptyForm() {
    return {
      title: '',
      summary: '',
      body: '',
      imageUrl: '',
    }
  },

  /* Artículo de la API → formulario (al editar). null pasa a texto vacío */
  toForm(article) {
    return {
      title: article.title,
      summary: article.summary,
      body: article.body,
      imageUrl: article.imageUrl ?? '',
    }
  },

  /*
   * Formulario → ArticleRequestDto del backend (al crear o editar).
   * Quita los espacios de los extremos y envía null si no hay imagen.
   * En el cuerpo solo se recortan los extremos: los saltos de línea
   * interiores se conservan, porque separan los párrafos.
   */
  toRequestDto(form) {
    const imageUrl = form.imageUrl.trim()
    return {
      title: form.title.trim(),
      summary: form.summary.trim(),
      body: form.body.trim(),
      imageUrl: imageUrl || null,
    }
  },
}