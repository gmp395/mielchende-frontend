<script setup>
/*
 * Amenazas para las abejas (Recursos apícolas): los principales peligros
 * para las colonias y qué hacemos en el apiario para protegerlas.
 * Contenido estático: los textos están en arrays para mantener limpio el template.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta en import.
 */
const IMAGES = {
  entrance: '/images/content/abejas-con-polen.jpg',
  landscape: '/images/content/santalla.jpg',
}

/*
 * Principales amenazas.
 * paragraphs: la descripción, un elemento por párrafo.
 * actionLabel y action: la pregunta y lo que hacemos para hacerle frente.
 */
const threats = [
  {
    title: 'La varroa',
    paragraphs: [
      'La varroa es un ácaro parásito que afecta a las abejas adultas y a sus crías. Además de debilitarlas, favorece la transmisión de virus que pueden comprometer la salud de toda la colonia. Sin un control adecuado, puede llegar a provocar su desaparición.',
    ],
    actionLabel: '¿Cómo la controlamos?',
    action:
      'Revisamos el estado de las colonias y aplicamos tratamientos contra la varroa después de la cosecha, siguiendo las pautas adecuadas para mantenerlas sanas.',
  },
  {
    title: 'La avispa velutina',
    paragraphs: [
      'La avispa velutina, también conocida como avispa asiática, es una especie invasora presente en buena parte del norte de España. Captura abejas cerca de las colmenas para alimentar a sus larvas y puede ejercer una gran presión sobre las colonias.',
      'Cuando los ataques son frecuentes, las abejas reducen sus salidas para recolectar alimento, lo que dificulta el desarrollo de la colonia.',
    ],
    actionLabel: '¿Cómo las protegemos?',
    action:
      'Vigilamos la actividad de las avispas en el apiario y utilizamos medidas de protección en las entradas de las colmenas cuando es necesario.',
  },
  {
    title: 'Los pesticidas',
    paragraphs: [
      'La exposición a determinados productos fitosanitarios puede afectar a la orientación, el comportamiento y la supervivencia de las abejas. Sus efectos dependen del producto, la dosis y las condiciones de exposición.',
    ],
    actionLabel: '¿Cómo reducimos el riesgo?',
    action:
      'Nuestro apiario se encuentra en un entorno de bosque y vegetación silvestre, alejado de cultivos intensivos. Esta ubicación ayuda a reducir algunas fuentes de exposición, aunque no elimina por completo los posibles riesgos.',
  },
  {
    title: 'La pérdida de hábitat',
    paragraphs: [
      'Los cambios en el paisaje, la desaparición de prados y setos y la pérdida de diversidad floral reducen los recursos que las abejas necesitan para alimentarse a lo largo del año.',
    ],
    actionLabel: '¿Qué aporta nuestro entorno?',
    action:
      'Trabajamos en la Reserva de la Biosfera Terras do Miño, un espacio de gran valor natural donde la diversidad de paisajes y vegetación contribuye a ofrecer recursos a las abejas durante distintas épocas del año.',
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Amenazas para las abejas</h1>
      <p class="mt-4 text-muted-foreground">
        Las abejas se enfrentan a distintas amenazas que pueden debilitar sus colonias y poner en
        riesgo su supervivencia. Conocerlas es el primer paso para protegerlas. Te contamos cuáles
        son las principales y cómo cuidamos de nuestras colmenas en Miel Chende.
      </p>
    </header>

    <!-- Principales amenazas -->
    <section class="mt-14" aria-labelledby="threats-title">
      <h2 id="threats-title" class="text-3xl">Las principales amenazas</h2>
      <ul class="mt-8 grid gap-8 md:grid-cols-2">
        <li
          v-for="threat in threats"
          :key="threat.title"
          class="rounded-xl border border-border bg-card p-6"
        >
          <h3 class="text-xl">{{ threat.title }}</h3>
          <!-- Un <p> por párrafo de la descripción -->
          <p
            v-for="paragraph in threat.paragraphs"
            :key="paragraph"
            class="mt-2 text-muted-foreground"
          >
            {{ paragraph }}
          </p>
          <!-- Lo que hacemos, con su propia pregunta en cada amenaza -->
          <p class="mt-4 text-sm">
            <span class="font-semibold">{{ threat.actionLabel }} </span>
            <span class="text-muted-foreground">{{ threat.action }}</span>
          </p>
        </li>
      </ul>
    </section>
  </section>

  <!-- Destacado: la piquera, primera línea de defensa -->
  <section class="surface-warm" aria-labelledby="defense-title">
    <div class="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
      <img
        :src="IMAGES.entrance"
        alt="Abejas obreras llegando a la colmena con bolas de polen en las patas"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Defensa de la colmena</p>
        <h2 id="defense-title" class="mt-3 text-3xl">La piquera, primera línea de defensa</h2>
        <p class="mt-4 text-muted-foreground">
          La piquera es la entrada de la colmena y uno de los puntos que las abejas guardianas
          protegen. Frente a la avispa velutina, facilitar la defensa de este acceso puede ser
          especialmente importante.
        </p>
        <p class="mt-4 text-muted-foreground">
          En épocas de mayor presión, reducir la abertura de la piquera y utilizar protecciones
          adecuadas ayuda a las obreras a defender mejor la entrada y dificulta el acceso de las
          avispas.
        </p>
      </div>
    </div>
  </section>

  <!-- Entorno y llamada a la acción -->
  <section class="container-page py-20" aria-labelledby="habitat-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="habitat-title" class="text-3xl">Un entorno que también importa</h2>
        <p class="mt-4 text-muted-foreground">
          La salud de las abejas está estrechamente relacionada con el paisaje que las rodea. La
          diversidad de flores, la presencia de vegetación silvestre y la conservación de los
          espacios naturales favorecen la disponibilidad de alimento.
        </p>
        <p class="mt-4 text-muted-foreground">
          Nuestras colmenas están rodeadas de bosque y vegetación natural, en un entorno sin
          cultivos intensivos cercanos. Un paisaje que forma parte de la identidad de Miel Chende y
          de nuestra manera de entender la apicultura.
        </p>
      </div>
      <!-- alt provisional: pendiente de confirmar qué muestra la foto -->
      <img
        :src="IMAGES.landscape"
        alt="Paisaje del entorno del apiario"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </div>

    <!-- Llamada a la acción -->
    <div class="mt-16 rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">¿Quieres ayudar a las abejas?</h2>
      <p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
        Elegir miel local es una forma de apoyar a los apicultores que cuidan de sus colmenas y
        contribuyen a mantener viva la apicultura de nuestro entorno.
      </p>
      <p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
        Descubre nuestras mieles y conoce un poco más de cerca el mundo del que nacen.
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