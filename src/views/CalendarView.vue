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
  harvest: '/images/content/cuadro-de-miel-operculada.jpg',
  extraction: '/images/content/desoperculado.jpg',
}

/*
 * Las cuatro estaciones del año apícola.
 * Cada una con sus meses y las tareas principales del apiario.
 */
const seasons = [
  {
    name: 'Invierno',
    months: 'Diciembre – Febrero',
    tasks: [
      'Las abejas se agrupan en racimo para mantener el calor de la colonia.',
      'Vigilamos las reservas de alimento sin abrir las colmenas.',
      'Reparamos material y preparamos cuadros para la nueva temporada.',
    ],
  },
  {
    name: 'Primavera',
    months: 'Marzo – Mayo',
    tasks: [
      'Primeras revisiones en los días de buen tiempo.',
      'La colonia crece con rapidez gracias a la floración.',
      'Controlamos la enjambrazón, criamos reinas y formamos nuevos enjambres.',
    ],
  },
  {
    name: 'Verano',
    months: 'Junio – Agosto',
    tasks: [
      'Floración del castaño y de las flores silvestres de Terras do Miño.',
      'Colocamos las alzas, donde las abejas almacenan la miel.',
      'Vigilamos la presencia de la avispa velutina.',
    ],
  },
  {
    name: 'Otoño',
    months: 'Septiembre – Noviembre',
    tasks: [
      'Cosecha y extracción de la miel a primeros de septiembre.',
      'Tratamiento contra la varroa, el principal parásito de la abeja.',
      'Reducimos las piqueras y preparamos las colmenas para el invierno.',
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
        El trabajo en el apiario sigue el ritmo de las estaciones y de las flores. Así es nuestro
        año, desde el reposo del invierno hasta la cosecha.
      </p>
    </header>

    <!-- Las cuatro estaciones -->
    <section class="mt-14" aria-labelledby="seasons-title">
      <h2 id="seasons-title" class="text-3xl">Las estaciones en el apiario</h2>
      <ul class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="season in seasons"
          :key="season.name"
          class="rounded-xl border border-border bg-card p-6"
        >
          <p class="eyebrow">{{ season.months }}</p>
          <h3 class="mt-2 text-xl">{{ season.name }}</h3>
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
        alt="Cuadro de panal con la miel cubierta por una capa de cera"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">La cosecha</p>
        <h2 id="harvest-title" class="mt-3 text-3xl">Una sola cosecha al año</h2>
        <p class="mt-4 text-muted-foreground">
          Cosechamos a primeros de septiembre, cuando las abejas han cerrado con cera las celdas
          llenas de miel: es la señal de que está madura. Solo retiramos el excedente y dejamos a la
          colonia las reservas que necesita para pasar el invierno.
        </p>
        <p class="mt-4 text-muted-foreground">
          Por eso nuestra miel es limitada: lo que se recoge en septiembre es lo que hay hasta la
          cosecha siguiente.
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
          Tras retirar los cuadros, quitamos la capa de cera que cierra las celdas (el desoperculado),
          extraemos la miel y la dejamos reposar y colar antes de envasarla. Sin calentarla ni
          filtrarla en exceso, para que conserve todo lo que la hace especial.
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
      <p class="mt-2 text-muted-foreground">
        Consulta qué productos tenemos disponibles o escríbenos si tienes cualquier duda.
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