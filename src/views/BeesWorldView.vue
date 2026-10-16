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
  drones: '/images/content/zangano.jpg',
  pollination: '/images/content/abejas.jpg',
  pollen: '/images/content/polen-en-las-celdas.jpg',
}

/*
 * Los tres tipos de abeja de una colonia.
 * paragraphs: cada elemento es un párrafo de la tarjeta.
 */
const castes = [
  {
    title: 'La reina',
    image: IMAGES.queen,
    alt: 'Reina marcada con un punto verde en el tórax, sobre un panal',
    paragraphs: [
      'Es la hembra reproductora de la colonia y la madre de la mayoría de las abejas que viven en ella. Durante la temporada de mayor actividad puede poner más de mil huevos al día y vivir varios años.',
      'Para localizarla con más facilidad entre miles de abejas, los apicultores suelen marcarla con un pequeño punto de color en el tórax.',
    ],
  },
  {
    title: 'Las obreras',
    image: IMAGES.workers,
    alt: 'Abejas obreras llegando a la colmena con bolas de polen en las patas',
    paragraphs: [
      'Son hembras y constituyen la gran mayoría de la colonia. A lo largo de su vida realizan distintas tareas: limpian las celdas, alimentan a las larvas, construyen los panales, vigilan la entrada de la colmena y salen al campo en busca de néctar, polen, agua y propóleo.',
      'Su trabajo es imprescindible para mantener la colonia, cuidar de las nuevas generaciones y conseguir los recursos que necesitan para vivir.',
    ],
  },
  {
    title: 'Los zánganos',
    image: IMAGES.drones,
    alt: 'Zángano, de ojos grandes y cuerpo robusto, junto a obreras sobre el panal',
    paragraphs: [
      'Son los machos de la colonia. Su principal función es fecundar a las reinas durante el vuelo nupcial. No tienen aguijón y, a diferencia de las obreras, no participan en la recolección de néctar ni de polen.',
      'Su presencia es más habitual en primavera y verano. Cuando escasean los recursos, especialmente en otoño, las obreras pueden expulsarlos de la colmena. Los zánganos también desempeñan un papel importante en la diversidad genética de las poblaciones de abejas.',
    ],
  },
]

/* Curiosidades breves */
const curiosities = [
  {
    title: 'Hexágonos casi perfectos',
    text: 'Las celdas hexagonales de los panales permiten aprovechar muy bien el espacio y almacenar miel, polen y criar nuevas abejas utilizando una cantidad relativamente pequeña de cera.',
  },
  {
    title: 'Un idioma de baile',
    text: 'Cuando una abeja encuentra una fuente de alimento interesante, puede regresar a la colmena y comunicar a sus compañeras dónde está mediante una danza. Sus movimientos indican la dirección y la distancia aproximada a la que se encuentran las flores.',
  },
  {
    title: 'Un color para cada año',
    text: 'Los apicultores utilizan un código internacional de cinco colores para marcar a las reinas y reconocer su año de nacimiento: blanco, amarillo, rojo, verde y azul. El color se repite cada cinco años, siguiendo una secuencia establecida.',
  },
  {
    title: 'El polen, su fuente de proteínas',
    text: 'El polen aporta proteínas, grasas y otros nutrientes esenciales para la colonia. Las abejas obreras lo recogen de las flores y lo almacenan en las celdas del panal. Es especialmente importante para alimentar a las larvas y favorecer el desarrollo de las abejas jóvenes.',
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">El mundo de las abejas</h1>
      <p class="mt-4 text-muted-foreground">
        Una colmena es mucho más que un lugar donde viven las abejas: es una pequeña sociedad en la
        que cada una cumple una función.
      </p>
    </header>

    <!-- La colmena: reina, obreras y zánganos -->
    <section class="mt-14" aria-labelledby="hive-title">
      <h2 id="hive-title" class="text-3xl">Los habitantes de la colmena</h2>
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
            <!-- Un <p> por párrafo; la clave es el propio texto, que no se repite -->
            <p
              v-for="paragraph in caste.paragraphs"
              :key="paragraph"
              class="mt-2 text-muted-foreground"
            >
              {{ paragraph }}
            </p>
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
        alt="Abejas en vuelo sobre los cuadros de una colmena abierta"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Polinización</p>
        <h2 id="pollination-title" class="mt-3 text-3xl">Sin abejas, menos frutos</h2>
        <p class="mt-4 text-muted-foreground">
          Cuando una abeja visita una flor, puede transportar polen de una flor a otra y hacer
          posible la formación de frutos y semillas.
        </p>
        <p class="mt-4 text-muted-foreground">
          Muchos cultivos de frutas y hortalizas se benefician de la polinización realizada por las
          abejas y otros insectos. De este modo, las abejas contribuyen a la biodiversidad y a la
          producción de muchos de los alimentos que llegan a nuestra mesa.
        </p>
        <p class="mt-4 text-muted-foreground">
          Cuidar de las abejas es también cuidar de los campos, los bosques y el paisaje que nos
          rodea.
        </p>
      </div>
    </div>
  </section>

  <!-- Curiosidades -->
  <section class="container-page py-20" aria-labelledby="curiosities-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
      <div>
        <h2 id="curiosities-title" class="text-3xl">Curiosidades del mundo de las abejas</h2>
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
      <p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
        El mundo de las abejas es fascinante, y siempre hay algo nuevo que descubrir. Si quieres
        saber más sobre nuestras abejas y nuestra forma de trabajar, estaremos encantados de
        atenderte.
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