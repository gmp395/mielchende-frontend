<script setup>
/*
 * Actualidad apícola (Recursos apícolas).
 * De momento no hay noticias en la base de datos: la actualidad del apiario
 * se publica en las redes sociales, así que esta página remite a ellas.
 * Cuando el admin pueda publicar noticias, esta vista pasará a ser el listado.
 */
import { RouterLink } from 'vue-router'
import SocialIcon from '@/components/common/SocialIcon.vue'
import { SOCIAL_LINKS } from '@/constants/contact'

/*
 * Ruta de la foto (carpeta public).
 * Se enlaza con :src para que el compilador de Vue no la convierta en import.
 */
const BANNER_IMAGE = '/images/banners/colmenas-en-fila.jpg'

/* Qué tipo de contenido publicamos, para que se sepa qué se va a encontrar */
const topics = [
  {
    title: 'Novedades del apiario',
    text: 'Cómo va la temporada, las revisiones de las colmenas y el día a día con las abejas.',
  },
  {
    title: 'Ferias y cursos',
    text: 'Las ferias y mercados en los que estaremos, y las actividades de formación apícola.',
  },
  {
    title: 'Fotos y vídeos',
    text: 'Imágenes del apiario y de la cosecha, y vídeos de nuestro trabajo en el canal de YouTube.',
  },
]
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Actualidad apícola</h1>
      <p class="mt-4 text-muted-foreground">
        Lo que pasa en el apiario lo contamos casi a diario en nuestras redes sociales. Síguenos
        para no perderte nada.
      </p>
    </header>

    <!-- Qué publicamos -->
    <section class="mt-14" aria-labelledby="topics-title">
      <h2 id="topics-title" class="text-3xl">Qué vas a encontrar</h2>
      <ul class="mt-8 grid gap-8 md:grid-cols-3">
        <li
          v-for="topic in topics"
          :key="topic.title"
          class="rounded-xl border border-border bg-card p-6"
        >
          <h3 class="text-xl">{{ topic.title }}</h3>
          <p class="mt-2 text-muted-foreground">{{ topic.text }}</p>
        </li>
      </ul>
    </section>
  </section>

  <!-- Redes sociales: foto y enlaces en dos columnas -->
  <section class="surface-warm" aria-labelledby="social-title">
    <div class="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
      <img
        :src="BANNER_IMAGE"
        alt="Colmenas en fila en el apiario"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Síguenos</p>
        <h2 id="social-title" class="mt-3 text-3xl">Nuestras redes</h2>
        <!--
          Enlaces externos: target _blank abre una pestaña nueva y
          rel noopener noreferrer impide que esa página controle la nuestra.
        -->
        <ul class="mt-6 space-y-3">
          <li v-for="link in SOCIAL_LINKS" :key="link.name">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
            >
              <span
                class="flex size-11 items-center justify-center rounded-full border border-border"
              >
                <SocialIcon :icon="link.icon" />
              </span>
              <span>{{ link.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Llamada a la acción -->
  <section class="container-page py-20">
    <div class="rounded-xl border border-border bg-card p-8 text-center">
      <h2 class="text-2xl">¿Tienes alguna pregunta?</h2>
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