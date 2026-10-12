<script setup>
/*
 * Guías prácticas (Recursos apícolas): consejos breves para conservar
 * y disfrutar de los productos de la colmena.
 * Contenido estático: los textos están en arrays para mantener limpio el template.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta en import.
 */
const IMAGES = {
  honeycomb: '/images/content/panal-de-cera.jpg',
  pollen: '/images/content/polen-en-la-trampa.jpg',
}

/* Cada guía: un título, una introducción y unos pasos o consejos */
const guides = [
  {
    title: 'Cómo conservar la miel',
    intro: 'La miel es uno de los alimentos que mejor se conservan, si se guarda bien.',
    tips: [
      'Guárdala en un lugar fresco y seco, lejos de la luz y de fuentes de calor.',
      'Mantén el tarro bien cerrado: la miel absorbe la humedad y los olores.',
      'No necesita nevera; el frío solo acelera que cristalice.',
      'Usa siempre una cuchara limpia y seca.',
    ],
  },
  {
    title: 'Por qué cristaliza la miel',
    intro:
      'Que la miel cristalice es un proceso natural y una buena señal: es propio de la miel cruda, sin calentar.',
    tips: [
      'Cada miel cristaliza a su ritmo según las flores de las que procede: la de castaño tarda mucho más que la de milflores.',
      'La miel cristalizada conserva todas sus propiedades y su sabor.',
      'Si la prefieres líquida, caliéntala al baño maría a fuego muy suave, sin que el agua llegue a hervir.',
      'Evita el microondas: el calor fuerte estropea sus aromas y propiedades.',
    ],
  },
  {
    title: 'Cómo tomar y conservar el polen',
    intro: 'El polen es el alimento proteico de las abejas, y también un buen complemento para nosotros.',
    tips: [
      'Guárdalo en la nevera, o en el congelador si es para mucho tiempo.',
      'Tómalo solo, o mezclado con yogur, zumo o cereales.',
      'Empieza con poca cantidad para comprobar cómo te sienta.',
      'Si tienes alergia al polen, consulta antes con tu médico.',
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
        Consejos sencillos para conservar y disfrutar de los productos de la colmena.
      </p>
    </header>

    <!-- Las guías -->
    <section class="mt-14" aria-labelledby="guides-title">
      <h2 id="guides-title" class="sr-only">Guías</h2>
      <ul class="grid gap-8 lg:grid-cols-3">
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

  <!-- Aviso importante: miel y bebés -->
  <section class="surface-warm" aria-labelledby="babies-title">
    <div class="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
      <img
        :src="IMAGES.honeycomb"
        alt="Panal de cera con celdas hexagonales"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Importante</p>
        <h2 id="babies-title" class="mt-3 text-3xl">Nada de miel antes del año</h2>
        <p class="mt-4 text-muted-foreground">
          Las autoridades sanitarias recomiendan no dar miel a bebés menores de 12 meses. Su sistema
          digestivo todavía no está preparado y existe riesgo de botulismo infantil. A partir del año
          ya pueden tomarla sin problema.
        </p>
      </div>
    </div>
  </section>

  <!-- Polen y llamada a la acción -->
  <section class="container-page py-20" aria-labelledby="products-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="products-title" class="text-3xl">Más allá de la miel</h2>
        <p class="mt-4 text-muted-foreground">
          La colmena nos da también polen, propóleo y cera. Cada producto tiene su forma de
          conservarse y de usarse: si tienes dudas sobre cualquiera de ellos, pregúntanos.
        </p>
      </div>
      <img
        :src="IMAGES.pollen"
        alt="Polen recogido en la trampa de la colmena"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </div>

    <!-- Llamada a la acción -->
    <div class="mt-16 rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">¿Te ha quedado alguna duda?</h2>
      <p class="mt-2 text-muted-foreground">
        Escríbenos o descubre los productos de esta temporada.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <RouterLink
          :to="{ name: 'catalog' }"
          class="rounded-md bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver el catálogo
        </RouterLink>
        <RouterLink
          :to="{ name: 'contact' }"
          class="rounded-md border border-border px-5 py-2.5 transition-colors hover:bg-secondary"
        >
          Contactar
        </RouterLink>
      </div>
    </div>
  </section>
</template>