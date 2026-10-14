<script setup>
/*
 * Política de privacidad: cómo se tratan los datos personales (RGPD).
 * Contenido estático: los textos están en un array para mantener limpio el template.
 * Los datos del titular vienen de constants/legal.js (de ejemplo hasta publicar).
 */
import LegalPage from '@/components/legal/LegalPage.vue'
import { CONTACT_EMAIL } from '@/constants/contact'
import { LEGAL_INFO } from '@/constants/legal'

const sections = [
  {
    id: 'controller',
    title: 'Responsable del tratamiento',
    items: [
      `Titular: ${LEGAL_INFO.ownerName}`,
      `NIF: ${LEGAL_INFO.taxId}`,
      `Domicilio: ${LEGAL_INFO.address}`,
      `Correo electrónico: ${CONTACT_EMAIL}`,
    ],
  },
  {
    id: 'data',
    title: 'Qué datos tratamos',
    items: [
      'Al crear una cuenta: tu nombre, tu correo electrónico y tu contraseña. La contraseña no se guarda tal cual: se almacena protegida con un algoritmo de hash.',
      'Al enviar una solicitud: los productos y cantidades que eliges y, si los indicas, tu teléfono y tus comentarios.',
      'Al escribirnos por correo electrónico: los datos que incluyas en tu mensaje.',
    ],
  },
  {
    id: 'purposes',
    title: 'Para qué los usamos',
    items: [
      'Gestionar tu cuenta.',
      'Gestionar tus solicitudes: revisarlas, confirmarlas, enviarte los datos para el pago y coordinar la entrega.',
      'Responder a tus consultas.',
    ],
    paragraphs: [
      'No usamos tus datos para enviarte publicidad ni para elaborar perfiles.',
    ],
  },
  {
    id: 'legal-basis',
    title: 'Base legal',
    paragraphs: [
      'Tratamos tus datos porque son necesarios para gestionar tu cuenta y tus solicitudes, que nos pides tú (artículo 6.1.b del Reglamento General de Protección de Datos), y para cumplir las obligaciones legales que se deriven de la venta, como las fiscales (artículo 6.1.c).',
    ],
  },
  {
    id: 'retention',
    title: 'Cuánto tiempo los conservamos',
    paragraphs: [
      'Mientras mantengas tu cuenta. Los datos de las solicitudes se conservan además durante los plazos que exige la ley. Pasados esos plazos, se eliminan.',
    ],
  },
  {
    id: 'recipients',
    title: 'Con quién los compartimos',
    paragraphs: [
      'No cedemos tus datos a terceros, salvo obligación legal.',
      `Para que la web funcione contamos con proveedores técnicos (alojamiento web: ${LEGAL_INFO.hostingProvider}, y servicio de correo electrónico), que solo tratan los datos por cuenta del titular.`,
    ],
  },
  {
    id: 'rights',
    title: 'Tus derechos',
    paragraphs: [
      `Puedes ejercer tus derechos escribiendo a ${CONTACT_EMAIL} con el asunto «Protección de datos»:`,
    ],
    items: [
      'Acceso: saber qué datos tuyos tratamos.',
      'Rectificación: corregir datos incorrectos.',
      'Supresión: pedir que los eliminemos.',
      'Oposición y limitación: pedir que dejemos de tratarlos o que limitemos su uso.',
      'Portabilidad: recibirlos en un formato que puedas llevar a otro servicio.',
    ],
  },
  {
    id: 'complaint',
    title: 'Reclamaciones',
    paragraphs: [
      'Si consideras que no hemos tratado bien tus datos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).',
    ],
  },
  {
    id: 'storage',
    title: 'Almacenamiento en tu navegador',
    paragraphs: [
      'No usamos cookies de análisis ni de publicidad. Al iniciar sesión guardamos en el almacenamiento local de tu navegador un identificador de sesión (token), necesario para mantenerla abierta. Se elimina al cerrar sesión.',
    ],
  },
]
</script>

<template>
  <LegalPage
    title="Política de privacidad"
    intro="Te explicamos qué datos personales tratamos, para qué y qué derechos tienes."
    :sections="sections"
  />
</template>