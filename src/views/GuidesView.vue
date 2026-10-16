<script setup>
/*
 * Guías prácticas (Recursos apícolas): consejos breves para conservar
 * y disfrutar de los productos de la colmena, y una sección sobre el propóleo.
 * Contenido estático: los textos están en arrays para mantener limpio el template.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta en import.
 */
const IMAGES = {
  honeycomb: '/images/content/panal-de-cera.jpg',
  propolis: '/images/content/propoleo-en-reja.jpg',
}

/* Cada guía: un título, una introducción y unos consejos */
const guides = [
  {
    title: 'Cómo conservar la miel',
    intro:
      'La miel se conserva durante mucho tiempo si se guarda en las condiciones adecuadas. Con unos cuidados sencillos, podrás disfrutar de su aroma y sabor durante meses.',
    tips: [
      'Guárdala en un lugar fresco y seco, protegida de la luz solar directa y de las fuentes de calor.',
      'Mantén el tarro bien cerrado para evitar que absorba humedad y olores del ambiente.',
      'No necesita refrigeración. A temperatura ambiente suele conservarse mejor su textura habitual.',
      'Utiliza siempre una cuchara limpia y seca para evitar introducir agua o restos de otros alimentos.',
    ],
  },
  {
    title: '¿Por qué cristaliza la miel?',
    intro:
      'Si tu miel se vuelve más espesa o aparecen pequeños cristales, no te preocupes: es un proceso natural. La cristalización depende, entre otros factores, de la proporción de azúcares y del origen floral de la miel.',
    tips: [
      'Cada miel cristaliza a su propio ritmo. Algunas permanecen líquidas durante mucho tiempo, mientras que otras cristalizan en pocas semanas.',
      'La cristalización no significa que la miel se haya estropeado. Puede seguir disfrutándose con normalidad.',
      'Si prefieres una textura líquida, coloca el tarro al baño maría con agua templada y caliéntalo suavemente.',
      'Evita las temperaturas elevadas y el calentamiento excesivo, ya que pueden alterar los aromas y algunas de las características de la miel.',
    ],
  },
  {
    title: 'Cómo conservar y disfrutar del polen',
    intro:
      'El polen de abeja se recoge de las flores y constituye una fuente de nutrientes para la colonia. También se comercializa como alimento, pero su conservación depende de cómo se haya preparado y presentado.',
    tips: [
      'Sigue las indicaciones de conservación de la etiqueta. El polen fresco suele necesitar refrigeración o congelación, mientras que el polen deshidratado debe mantenerse bien cerrado, en un lugar fresco y seco.',
      'Puedes añadirlo, si así lo deseas, a yogures, cereales o batidos.',
      'Si nunca lo has consumido, ten en cuenta que puede provocar reacciones alérgicas. Si tienes alergia al polen o antecedentes de reacciones alérgicas, consulta con un profesional sanitario antes de probarlo.',
    ],
  },
]

/*
 * Sección del propóleo: un subtítulo y sus párrafos por apartado.
 * Así el template solo recorre la lista, sin repetir marcado.
 */
const propolisSections = [
  {
    title: '¿Qué es el propóleo?',
    paragraphs: [
      'El propóleo es una sustancia resinosa que las abejas elaboran a partir de resinas y otras sustancias que recogen de las plantas, mezclándolas con cera y sus propias secreciones.',
      'Dentro de la colmena lo utilizan para sellar pequeñas grietas, cubrir superficies y contribuir a mantener un ambiente adecuado para la colonia. Es una de las formas en las que las abejas protegen el lugar donde viven.',
    ],
  },
  {
    title: '¿Para qué se utiliza?',
    paragraphs: [
      'El propóleo se utiliza tradicionalmente en distintos preparados, como extractos, sprays, tinturas y pastillas. Su composición varía según las plantas de las que proceden las resinas y la zona donde se recoge.',
      'Se han estudiado sus componentes por su actividad antimicrobiana y antiinflamatoria en determinadas condiciones, aunque las pruebas sobre sus beneficios para la salud en personas son limitadas y dependen del uso concreto.',
      'Si estás pensando en utilizarlo, conviene seguir las indicaciones del producto y tener en cuenta que puede provocar reacciones alérgicas, especialmente en personas sensibles a los productos apícolas.',
    ],
  },
  {
    title: 'Un producto con mucho que contar',
    paragraphs: [
      'Al igual que la miel, el polen y la cera, el propóleo nos permite descubrir otra faceta del trabajo de las abejas y de la riqueza de los productos de la colmena.',
    ],
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Guías prácticas</h1>
      <p class="mt-4 text-muted-foreground">
        ¿Cómo conservar la miel? ¿Por qué cristaliza? ¿Cómo guardar el polen? En esta sección
        encontrarás consejos sencillos para cuidar, conservar y disfrutar de los productos de la
        colmena.
      </p>
    </header>

    <!-- Las guías -->
    <section class="mt-14" aria-labelledby="guides-title">
      <h2 id="guides-title" class="text-3xl">Consejos para el día a día</h2>
      <ul class="mt-8 grid gap-8 lg:grid-cols-3">
        <li
          v-for="guide in guides"
          :key="guide.title"
          class="rounded-xl border border-border bg-card p-6"
        >
          <h3 class="text-xl">{{ guide.title }}</h3>
          <p class="mt-2 text-muted-foreground">{{ guide.intro }}</p>
          <ul class="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li v-for="tip in guide.tips" :key="tip">{{ tip }}</li>
          </ul>
        </li>
      </ul>
    </section>
  </section>

  <!-- El propóleo: foto del panal y texto en dos columnas -->
  <section class="surface-warm" aria-labelledby="propolis-title">
    <div class="container-page grid gap-10 py-20 lg:grid-cols-2 lg:items-start">
           
      <img
        :src="IMAGES.propolis"
        alt="Propóleo sobre la reja de la colmena"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <h2 id="propolis-title" class="text-3xl">El propóleo: el escudo natural de la colmena</h2>
        <!-- Un apartado por subtítulo, con sus párrafos -->
        <div v-for="section in propolisSections" :key="section.title" class="mt-6">
          <h3 class="text-xl">{{ section.title }}</h3>
          <p
            v-for="paragraph in section.paragraphs"
            :key="paragraph"
            class="mt-2 text-muted-foreground"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Otros productos y llamada a la acción -->
  <section class="container-page py-20" aria-labelledby="products-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="products-title" class="text-3xl">Más allá de la miel</h2>
        <p class="mt-4 text-muted-foreground">
          La colmena ofrece otros productos, como el polen, el propóleo y la cera de abeja. Cada uno
          tiene características y formas de conservación diferentes.
        </p>
        <p class="mt-4 text-muted-foreground">
          Si quieres conocer mejor estos productos o tienes alguna duda sobre los nuestros,
          estaremos encantados de ayudarte.
        </p>
      </div>
            <img
        :src="IMAGES.honeycomb"
        alt="Panal de cera con celdas hexagonales"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </div>

    <!-- Llamada a la acción -->
    <div class="mt-16 rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">¿Te ha quedado alguna duda?</h2>
      <p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
        Estamos aquí para ayudarte. Escríbenos si necesitas más información o descubre los
        productos de Miel Chende.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <RouterLink
          :to="{ name: 'catalog' }"
          class="rounded-md bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Descubre nuestros productos
        </RouterLink>
        <RouterLink
          :to="{ name: 'contact' }"
          class="rounded-md border border-border px-5 py-2.5 transition-colors hover:bg-secondary"
        >
          Contacta con nosotros
        </RouterLink>
      </div>
    </div>
  </section>
</template>