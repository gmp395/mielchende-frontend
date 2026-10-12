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
  entrance: '/images/content/abejas-en-la-piquera.jpg',
  landscape: '/images/banners/bosque-del-apiario.jpg',
}

/*
 * Principales amenazas.
 * Cada una con una descripción y lo que hacemos para hacerle frente.
 */
const threats = [
  {
    title: 'La varroa',
    text: 'Es un ácaro diminuto que se alimenta de las abejas y de sus crías, y les transmite virus. Sin control, puede acabar con una colonia en pocos años.',
    action: 'Revisamos su presencia durante la temporada y tratamos las colmenas después de la cosecha.',
  },
  {
    title: 'La avispa velutina',
    text: 'También llamada avispa asiática, es una especie invasora muy extendida en Galicia. Caza a las abejas en vuelo frente a la colmena y, si la presión es alta, las obreras dejan de salir a buscar alimento.',
    action: 'Vigilamos el apiario, reducimos las piqueras y colocamos protecciones en las entradas cuando más ataca.',
  },
  {
    title: 'Los pesticidas',
    text: 'Algunos productos fitosanitarios desorientan a las abejas o las debilitan, aunque no las maten de inmediato.',
    action: 'Situamos las colmenas lejos de cultivos intensivos, rodeadas de bosque y vegetación silvestre.',
  },
  {
    title: 'La pérdida de hábitat',
    text: 'Cuando desaparecen los prados, setos y bosques, las abejas pierden la variedad de flores que necesitan para alimentarse durante todo el año.',
    action: 'Trabajamos en la Reserva de la Biosfera Terras do Miño, un entorno con flora diversa y bien conservada.',
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Amenazas para las abejas</h1>
      <p class="mt-4 text-muted-foreground">
        Las abejas se enfrentan hoy a más peligros que nunca. Te contamos cuáles son los
        principales y qué hacemos en nuestro apiario para proteger a nuestras colonias.
      </p>
    </header>

    <!-- Principales amenazas -->
    <section class="mt-14" aria-labelledby="threats-title">
      <h2 id="threats-title" class="text-3xl">Principales amenazas</h2>
      <ul class="mt-8 grid gap-8 md:grid-cols-2">
        <li
          v-for="threat in threats"
          :key="threat.title"
          class="rounded-xl border border-border bg-card p-6"
        >
          <h3 class="text-xl">{{ threat.title }}</h3>
          <p class="mt-2 text-muted-foreground">{{ threat.text }}</p>
          <p class="mt-4 text-sm">
            <span class="font-semibold">Qué hacemos: </span>
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
        alt="Abejas entrando y saliendo de la colmena por la piquera"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Defensa de la colmena</p>
        <h2 id="defense-title" class="mt-3 text-3xl">La piquera, primera línea de defensa</h2>
        <p class="mt-4 text-muted-foreground">
          La piquera es la entrada de la colmena. Las obreras guardianas la vigilan sin descanso,
          pero frente a la avispa velutina necesitan ayuda: reducir su tamaño les permite
          defenderla mejor, sobre todo a finales de verano y en otoño.
        </p>
      </div>
    </div>
  </section>

  <!-- Entorno y llamada a la acción -->
  <section class="container-page py-20" aria-labelledby="habitat-title">
    <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 id="habitat-title" class="text-3xl">Un entorno que las protege</h2>
        <p class="mt-4 text-muted-foreground">
          La mejor protección para las abejas es un paisaje sano. Nuestras colmenas están rodeadas
          de bosque, en un entorno con flores silvestres y sin cultivos intensivos cerca. Cuidar
          ese entorno es también cuidar la calidad de nuestra miel.
        </p>
      </div>
      <img
        :src="IMAGES.landscape"
        alt="Bosque que rodea el apiario"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
    </div>

    <!-- Llamada a la acción -->
    <div class="mt-16 rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">¿Quieres ayudar a las abejas?</h2>
      <p class="mt-2 text-muted-foreground">
        Consumir miel local apoya a quienes las cuidan. Descubre nuestros productos o escríbenos si
        tienes cualquier duda.
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