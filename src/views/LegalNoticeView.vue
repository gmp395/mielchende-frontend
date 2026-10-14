<script setup>
/*
 * Aviso legal: datos del titular de la web (LSSI-CE) y condiciones de uso.
 * Contenido estático: los textos están en un array para mantener limpio el template.
 * Los datos del titular vienen de constants/legal.js (de ejemplo hasta publicar).
 */
import LegalPage from '@/components/legal/LegalPage.vue'
import { CONTACT_EMAIL } from '@/constants/contact'
import { LEGAL_INFO } from '@/constants/legal'

const sections = [
  {
    id: 'owner',
    title: 'Datos identificativos',
    paragraphs: [
      'En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de esta web:',
    ],
    items: [
      `Titular: ${LEGAL_INFO.ownerName}`,
      `NIF: ${LEGAL_INFO.taxId}`,
      `Domicilio: ${LEGAL_INFO.address}`,
      `Correo electrónico: ${CONTACT_EMAIL}`,
      `Actividad: ${LEGAL_INFO.activity}`,
    ],
  },
  {
    id: 'purpose',
    title: 'Objeto de la web',
    paragraphs: [
      'Miel Chende es la web de Apícola Chende. Permite consultar el catálogo de productos, enviar solicitudes de pedido y consultar contenidos sobre apicultura.',
      'En esta web no se realizan pagos. Enviar una solicitud no supone una compra: la revisamos y, si podemos atenderla, te la confirmamos por correo electrónico junto con los datos para el pago.',
    ],
  },
  {
    id: 'use',
    title: 'Condiciones de uso',
    paragraphs: [
      'Al usar esta web te comprometes a hacerlo de forma adecuada, a facilitar datos veraces al crear tu cuenta y enviar solicitudes, y a no utilizarla con fines ilícitos o que puedan dañar su funcionamiento.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Propiedad intelectual',
    paragraphs: [
      'Los textos, fotografías y el logotipo de esta web pertenecen a su titular, salvo que se indique lo contrario. No está permitido reproducirlos ni distribuirlos sin autorización.',
    ],
  },
  {
    id: 'liability',
    title: 'Responsabilidad y enlaces externos',
    paragraphs: [
      'Procuramos que la información de la web sea correcta y esté actualizada. La disponibilidad de los productos depende de la cosecha, que es una sola al año, por lo que puede variar.',
      'La web incluye enlaces a sitios de terceros, como nuestras redes sociales o Google Maps. No somos responsables de sus contenidos ni de sus políticas de privacidad.',
    ],
  },
  {
    id: 'law',
    title: 'Legislación aplicable',
    paragraphs: ['Este aviso legal se rige por la legislación española.'],
  },
]
</script>

<template>
  <LegalPage title="Aviso legal" :sections="sections" />
</template>