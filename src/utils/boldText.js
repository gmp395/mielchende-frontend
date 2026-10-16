/*
 * Negritas en textos escritos por el admin (artículos de Actualidad).
 * Admite solo una marca: **texto** → negrita. Es un subconjunto mínimo de Markdown.
 *
 * No genera HTML: devuelve una lista de trozos { text, bold } y el template
 * los pinta con <strong> o <span> usando {{ }}. Así Vue sigue escapando el texto
 * y no hace falta v-html (que abriría la puerta a ataques XSS).
 */
export function parseBold(text = '') {
  /*
   * split('**') parte el texto por cada marca.
   * Los trozos en posición impar (1, 3, 5…) son los que estaban entre dos marcas.
   * "Hola **mundo**" → ['Hola ', 'mundo', ''] → 'mundo' va en negrita.
   */
  const parts = text.split('**')
  const segments = parts.map((part, index) => ({ text: part, bold: index % 2 === 1 }))

  /*
   * Si hay un número impar de marcas, la última se ha quedado sin cerrar
   * ("Hola **mundo"). En ese caso no se pone en negrita: se muestra tal cual,
   * con sus asteriscos, para no poner en negrita el resto del texto por error.
   */
  if (parts.length % 2 === 0) {
    const last = segments[segments.length - 1]
    last.text = `**${last.text}`
    last.bold = false
  }

  /* Los trozos vacíos (por ejemplo, al empezar o acabar con **) no aportan nada */
  return segments.filter((segment) => segment.text !== '')
}