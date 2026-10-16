<script setup>
/*
 * Calendario apícola (Recursos apícolas): cómo se organiza el año en el apiario.
 * Contenido estático: los textos están en arrays para mantener limpio el template.
 * Refleja la realidad del negocio: una sola cosecha al año, a primeros de septiembre.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta en import.
 */
const IMAGES = {
  harvest: '/images/content/revision.jpg',
  extraction: '/images/content/desoperculado.jpg',
}

/*
 * Las cuatro estaciones del año apícola.
 * Cada una con sus meses, una introducción y las tareas principales del apiario.
 */
const seasons = [
  {
    name: 'Invierno',
    months: 'Diciembre – Febrero',
    intro:
      'Durante los meses más fríos, las abejas permanecen agrupadas formando un racimo para conservar el calor dentro de la colmena.',
    tasks: [
      'Vigilamos las reservas de alimento y el estado exterior de las colmenas, evitando abrirlas innecesariamente.',
      'Reparamos y mantenemos el material apícola.',
      'Preparamos cuadros y herramientas para la nueva temporada.',
    ],
  },
  {
    name: 'Primavera',
    months: 'Marzo – Mayo',
    intro:
      'Con la llegada del buen tiempo y las primeras floraciones, la actividad de la colmena aumenta. La reina incrementa la puesta y la colonia comienza a crecer.',
    tasks: [
      'Realizamos las primeras revisiones cuando las condiciones meteorológicas lo permiten.',
      'Comprobamos el desarrollo de las colonias y la disponibilidad de alimento.',
      'Vigilamos la enjambrazón y, cuando es necesario, formamos nuevos enjambres y criamos reinas.',
    ],
  },
  {
    name: 'Verano',
    months: 'Junio – Agosto',
    intro:
      'Es una época de intensa actividad. Las abejas aprovechan las floraciones del castaño y de otras plantas silvestres de nuestro entorno para recoger néctar y polen.',
    tasks: [
      'Colocamos las alzas para que las abejas puedan almacenar la miel.',
      'Seguimos de cerca el desarrollo de las colonias y sus reservas.',
      'Vigilamos la presencia de la avispa velutina y protegemos las colmenas cuando es necesario.',
    ],
  },
  {
    name: 'Otoño',
    months: 'Septiembre – Noviembre',
    intro:
      'Llega uno de los momentos más importantes del año: la cosecha. Después de recoger la miel, toca preparar las colonias para afrontar los meses más fríos.',
    tasks: [
      'Realizamos la cosecha y extracción de la miel a primeros de septiembre.',
      'Revisamos las reservas y el estado de las colonias.',
      'Aplicamos los tratamientos necesarios contra la varroa.',
      'Ajustamos las entradas de las colmenas y las preparamos para el invierno.',
    ],
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Calendario apícola</h1>
      <p class="mt-4 text-muted-foreground">
        En el apiario, cada estación trae nuevas tareas y cambios en la vida de las abejas. El
        trabajo sigue el ritmo de las flores, el clima y las necesidades de cada colonia. Así
        transcurre nuestro año, desde el reposo del invierno hasta la cosecha de miel.
      </p>
    </header>

    <!-- Las cuatro estaciones -->
    <section class="mt-14" aria-labelledby="seasons-title">
      <h2 id="seasons-title" class="text-3xl">Un año en el apiario</h2>
      <ul class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="season in seasons"
          :key="season.name"
          class="rounded-xl border border-border bg-card p-6"
        >
          <p class="eyebrow">{{ season.months }}</p>
          <h3 class="mt-2 text-xl">{{ season.name }}</h3>
          <!-- Introducción de la estación, antes de la lista de tareas -->
          <p class="mt-3">{{ season.intro }}</p>
          <ul class="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li v-for="task in season.tasks" :key="task">{{ task }}</li>
          </ul>
        </li>
      </ul>
    </section>
  </section>

  <!-- Destacado: una sola cosecha al año -->
  <section class="surface-warm" aria-labelledby="harvest-title">
    <div class="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
            <img
        :src="IMAGES.harvest"
        alt="Apicultor con traje y careta sacando de la colmena un cuadro de miel operculada"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">La cosecha</p>
        <h2 id="harvest-title" class="mt-3 text-3xl">
          Una cosecha al año, al ritmo de la naturaleza
        </h2>
        <p class="mt-4 text-muted-foreground">
          Nuestra cosecha tiene lugar a primeros de septiembre, cuando la miel ha alcanzado su
          madurez. Una de las señales que observamos es el operculado: las abejas cubren con una
          fina capa de cera las celdas que contienen la miel que ya está lista para conservarse.
        </p>
        <p class="mt-4 text-muted-foreground">
          En Miel Chende realizamos una única cosecha anual y solo retiramos la miel que
          podemos recoger sin comprometer las reservas necesarias para las colonias.
        </p>
        <p class="mt-4 text-muted-foreground">
          Por eso nuestra producción es limitada y depende de cada temporada, de las floraciones y
          de las condiciones del entorno. Cada tarro recoge el trabajo de las abejas durante todo un
          año.
        </p>
      </div>
    </div>
  </section>

  <!-- Extracción y llamada a la acción -->
  <section class="container-page py-20" aria-labelledby="extraction-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="extraction-title" class="text-3xl">De la colmena al tarro</h2>
        <p class="mt-4 text-muted-foreground">
          Una vez retirados los cuadros, comienza el proceso de extracción.
        </p>
        <p class="mt-4 text-muted-foreground">
          Primero retiramos la fina capa de cera que sella las celdas, un proceso conocido como
          desoperculado. Después extraemos la miel mediante centrifugado y la dejamos reposar para
          que las pequeñas partículas de cera y las burbujas de aire puedan separarse antes del
          envasado.
        </p>
        <p class="mt-4 text-muted-foreground">
          Cuidamos cada paso para respetar las características naturales de nuestra miel, evitando
          someterla a calentamientos innecesarios.
        </p>
      </div>
      <img
        :src="IMAGES.extraction"
        alt="Desoperculado de un cuadro de miel"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </div>

    <!-- Llamada a la acción -->
    <div class="mt-16 rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">La miel de esta temporada</h2>
      <p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
        Detrás de cada cosecha hay meses de trabajo, flores y dedicación. Descubre las mieles y
        productos disponibles de Miel Chende o ponte en contacto con nosotros si quieres saber más.
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