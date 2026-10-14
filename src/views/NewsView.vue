<script setup>
/*
 * Actualidad apícola (Recursos apícolas).
 * Muestra los artículos que el admin publica desde el panel (Contenidos)
 * y, debajo, remite a las redes sociales, donde se cuenta el día a día.
 * Si no hay artículos o la API falla, la página sigue teniendo contenido:
 * las redes y la llamada a la acción no dependen del backend.
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import SocialIcon from '@/components/common/SocialIcon.vue'
import { SOCIAL_LINKS } from '@/constants/contact'
import { articleRepository } from '@/api/articleRepository'
import { formatDate } from '@/utils/format'

/*
 * Ruta de la foto (carpeta public).
 * Se enlaza con :src para que el compilador de Vue no la convierta en import.
 */
const BANNER_IMAGE = '/images/banners/colmenas-en-fila.jpg'

/* Qué tipo de contenido publicamos en redes, para que se sepa qué se va a encontrar */
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

/* Artículos publicados (el backend ya los envía del más reciente al más antiguo) */
const articles = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

/*
 * Ids de los artículos cuya imagen no ha cargado (enlace roto).
 * Si falla, se oculta la imagen en lugar de mostrar el icono de imagen rota.
 */
const brokenImageIds = ref(new Set())

async function loadArticles() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    articles.value = await articleRepository.getPublished()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function hideBrokenImage(articleId) {
  brokenImageIds.value = new Set(brokenImageIds.value).add(articleId)
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadArticles()
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Recursos apícolas</p>
      <h1 class="mt-3 text-4xl">Actualidad apícola</h1>
      <p class="mt-4 text-muted-foreground">
        Noticias del apiario y de la temporada. El día a día lo contamos también en nuestras
        redes sociales.
      </p>
    </header>

    <!-- Artículos publicados desde el panel -->
    <section class="mt-14" aria-labelledby="news-title">
      <h2 id="news-title" class="text-3xl">Últimas noticias</h2>

      <!-- aria-live: el lector de pantalla anuncia la carga, el error o el resultado -->
      <div class="mt-8" aria-live="polite">
        <p v-if="isLoading" class="text-muted-foreground">Cargando noticias…</p>

        <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
          <p class="text-destructive">No se han podido cargar las noticias. {{ errorMessage }}</p>
          <button
            type="button"
            class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
            @click="loadArticles"
          >
            Reintentar
          </button>
        </div>

        <p v-else-if="articles.length === 0" class="text-muted-foreground">
          Todavía no hay noticias publicadas. Mientras tanto, puedes seguirnos en redes.
        </p>

        <div v-else class="space-y-10">
          <!-- article: contenido independiente, con sentido por sí mismo (HTML semántico) -->
          <article
            v-for="article in articles"
            :key="article.id"
            class="overflow-hidden rounded-xl border border-border bg-card"
          >
            <img
              v-if="article.imageUrl && !brokenImageIds.has(article.id)"
              :src="article.imageUrl"
              :alt="`Imagen de la noticia «${article.title}»`"
              class="aspect-video w-full object-cover"
              loading="lazy"
              @error="hideBrokenImage(article.id)"
            />
            <div class="p-6 md:p-8">
              <!-- time con datetime: la fecha legible por personas y por máquinas -->
              <time :datetime="article.publishedAt" class="text-sm text-muted-foreground">
                {{ formatDate(article.publishedAt) }}
              </time>
              <h3 class="mt-2 text-2xl">{{ article.title }}</h3>
              <p class="mt-3 font-medium">{{ article.summary }}</p>
              <!--
                whitespace-pre-line respeta los saltos de línea del texto.
                Se pinta con {{ }} (texto escapado), nunca con v-html, para evitar XSS.
              -->
              <p class="mt-4 whitespace-pre-line text-muted-foreground">{{ article.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Qué publicamos en redes -->
    <section class="mt-16" aria-labelledby="topics-title">
      <h2 id="topics-title" class="text-3xl">Qué vas a encontrar en redes</h2>
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