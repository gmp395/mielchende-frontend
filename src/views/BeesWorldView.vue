<script setup>
/*
 * Mundo de las abejas (Recursos apícolas): página divulgativa sobre la colmena,
 * con fotos reales del apiario.
 * Contenido estático: los textos están en arrays para mantener limpio el template.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta en import.
 */
const IMAGES = {
  queen: '/images/content/reina-marcada.jpg',
  workers: '/images/content/abejas-con-polen.jpg',
  drones: '/images/content/cuadro-con-abejas.jpg',
  pollination: '/images/content/abejas-en-la-piquera.jpg',
  pollen: '/images/content/polen-en-las-celdas.jpg',
}

/* Los tres tipos de abeja de una colonia */
const castes = [
  {
    title: 'La reina',
    image: IMAGES.queen,
    alt: 'Reina marcada con un punto verde, rodeada de obreras',
    text: 'Es la única hembra fértil de la colonia y la madre de todas sus abejas. En plena temporada puede poner más de mil huevos al día y vive varios años. Los apicultores la marcan con un punto de color para encontrarla entre miles de obreras.',
  },
  {
    title: 'Las obreras',
    image: IMAGES.workers,
    alt: 'Abejas obreras llegando a la colmena con bolas de polen en las patas',
    text: 'Son hembras y forman casi toda la colonia. Cambian de tarea según su edad: limpian las celdas, alimentan a las crías, construyen los panales, defienden la entrada y, al final de su vida, salen a recoger néctar, polen, agua y propóleo.',
  },
  {
    title: 'Los zánganos',
    image: IMAGES.drones,
    alt: 'Cuadro de la colmena cubierto de abejas',
    text: 'Son los machos. No tienen aguijón ni recogen alimento: su función es fecundar a reinas jóvenes. Aparecen en primavera y verano, y cuando llega el otoño las obreras los expulsan de la colmena.',
  },
]

/* Curiosidades breves */
const curiosities = [
  {
    title: 'Hexágonos perfectos',
    text: 'Las celdas hexagonales aprovechan al máximo el espacio con la menor cantidad posible de cera.',
  },
  {
    title: 'Un idioma de baile',
    text: 'Cuando una abeja encuentra flores, vuelve a la colmena y lo cuenta con una danza que indica la dirección y la distancia.',
  },
  {
    title: 'Un color por año',
    text: 'Las reinas se marcan con un código de cinco colores (blanco, amarillo, rojo, verde y azul) que indica el año en que nacieron.',
  },
  {
    title: 'El polen es su proteína',
    text: 'Las obreras lo guardan en las celdas, como se ve en la foto, para alimentar a las larvas.',
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Mundo de las abejas</h1>
      <p class="mt-4 text-muted-foreground">
        Una colmena es una pequeña sociedad perfectamente organizada. Te presentamos a sus
        habitantes, con fotos tomadas en nuestro apiario.
      </p>
    </header>

    <!-- La colmena: reina, obreras y zánganos -->
    <section class="mt-14" aria-labelledby="hive-title">
      <h2 id="hive-title" class="text-3xl">La colmena</h2>
      <ul class="mt-8 grid gap-8 md:grid-cols-3">
        <li
          v-for="caste in castes"
          :key="caste.title"
          class="overflow-hidden rounded-xl border border-border bg-card"
        >
          <img
            :src="caste.image"
            :alt="caste.alt"
            class="aspect-4/3 w-full object-cover"
            loading="lazy"
          />
          <div class="p-6">
            <h3 class="text-xl">{{ caste.title }}</h3>
            <p class="mt-2 text-muted-foreground">{{ caste.text }}</p>
          </div>
        </li>
      </ul>
    </section>
  </section>

  <!-- Polinización: foto y texto en dos columnas -->
  <section class="surface-warm" aria-labelledby="pollination-title">
    <div class="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
      <img
        :src="IMAGES.pollination"
        alt="Abejas entrando y saliendo de la colmena"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Polinización</p>
        <h2 id="pollination-title" class="mt-3 text-3xl">Sin abejas, menos frutos</h2>
        <p class="mt-4 text-muted-foreground">
          Al pasar de flor en flor, las abejas transportan el polen que permite a muchas plantas dar
          frutos y semillas. Buena parte de las frutas y hortalizas que comemos dependen, en algún
          grado, de los polinizadores. Cuidar de las abejas es cuidar del paisaje que nos rodea.
        </p>
      </div>
    </div>
  </section>

  <!-- Curiosidades -->
  <section class="container-page py-20" aria-labelledby="curiosities-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <h2 id="curiosities-title" class="text-3xl">Curiosidades</h2>
        <ul class="mt-8 space-y-6">
          <li v-for="item in curiosities" :key="item.title">
            <h3 class="text-xl">{{ item.title }}</h3>
            <p class="mt-1 text-muted-foreground">{{ item.text }}</p>
          </li>
        </ul>
      </div>
      <img
        :src="IMAGES.pollen"
        alt="Celdas de un panal llenas de polen de distintos colores"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </div>

    <!-- Llamada a la acción -->
    <div class="mt-16 rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">¿Te ha picado la curiosidad?</h2>
      <p class="mt-2 text-muted-foreground">
        Escríbenos si quieres saber más sobre nuestras abejas, o descubre lo que producen.
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