/*
 * Datos de contacto del negocio, en un solo sitio.
 * Los usan el pie de página y la página de Contacto:
 * si cambia alguno, solo hay que tocarlo aquí.
 * El correo del negocio no se publica en la web, para que no lo recojan los bots:
 * se contacta a través del formulario de la página de Contacto.
 */

/* Localidad (no la dirección exacta del apiario) */
export const LOCATION_LABEL = 'Cospeito, Lugo (Galicia)'

/* Punto de referencia público cercano al apiario */
export const LOCATION_REFERENCE = 'Cerca de la Lagoa de Cospeito'

/* Búsqueda del punto de referencia en Google Maps */
export const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Lagoa%20de%20Cospeito'

/*
 * Redes sociales del negocio.
 * "icon" indica qué dibujo pinta el pie; "name" es el texto visible en Contacto.
 * Si una URL está vacía, esa red no se muestra (así no publicamos enlaces falsos).
 */
export const SOCIAL_LINKS = [
  {
    icon: 'instagram',
    name: 'Instagram',
    label: 'Instagram de Miel Chende',
    url: 'https://www.instagram.com/apichende/',
  },
  {
    icon: 'facebook',
    name: 'Facebook',
    label: 'Facebook de Miel Chende',
    url: 'https://www.facebook.com/apicola.chende',
  },
  {
    icon: 'youtube',
    name: 'YouTube',
    label: 'Canal de YouTube de Miel Chende',
    url: 'https://www.youtube.com/@apicolachende1554',
  },
].filter((link) => link.url)