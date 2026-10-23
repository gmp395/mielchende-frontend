<script setup>
/*
 * Actualidad apícola (Recursos apícolas).
 * Reúne las citas y novedades del sector que publica el admin desde el panel
 * (Contenidos), y explica qué compartimos en cada red social.
 * Formato de periódico: el artículo seleccionado se lee en grande a la izquierda
 * y el resto aparece en un aside, en pequeño, a la derecha (debajo en móvil).
 * El artículo seleccionado va en la URL (?articulo=id), así funcionan el botón
 * Atrás del navegador y los enlaces compartidos; sin él, se muestra el más reciente.
 * Si no hay artículos o la API falla, la página sigue teniendo contenido:
 * las redes y la llamada a la acción no dependen del backend.
 */
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import SocialIcon from '@/components/common/SocialIcon.vue'
import { SOCIAL_LINKS } from '@/constants/contact'
import { articleRepository } from '@/api/articleRepository'
import { formatDate } from '@/utils/format'
import { parseBold } from '@/utils/boldText'

/*
 * Ruta de la foto (carpeta public).
 * Se enlaza con :src para que el compilador de Vue no la convierta en import.
 */
const BANNER_IMAGE = '/images/banners/apicultor-ahumador.jpg'

/* Qué compartimos en redes, para que se sepa qué se va a encontrar */
const topics = [
  {
    title: 'El día a día del apiario',
    text: 'Descubre cómo avanza la temporada y acompáñanos en el cuidado de nuestras colmenas.',
  },
  {
    title: 'Ferias y encuentros',
    text: 'Una selección de ferias, exposiciones y encuentros de interés para quienes disfrutan del mundo de las abejas y la apicultura.',
  },
  {
    title: 'Fotos y vídeos',
    text: 'Acércate al mundo de las abejas a través de imágenes de nuestro apiario, la cosecha y nuestro trabajo diario.',
  },
]

const route = useRoute()

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

/*
 * Artículo que se lee en grande: el de la URL (?articulo=id) si existe;
 * si no hay ninguno indicado, o el id no corresponde a un artículo publicado,
 * el más reciente (el primero de la lista).
 * Los parámetros de la URL llegan siempre como texto: por eso se compara con String(id).
 */
const selectedArticle = computed(
  () =>
    articles.value.find((article) => String(article.id) === route.query.articulo) ??
    articles.value[0],
)

/* true si el artículo es el que se está leyendo (lo usa el aside para marcarlo) */
function isSelected(article) {
  return article.id === selectedArticle.value?.id
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
        Seguimos de cerca el mundo de la apicultura y compartimos las citas y novedades que merece
        la pena conocer.
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

        <!--
          Dos columnas desde lg: artículo (2/3) y aside (1/3).
          En móvil se apilan: primero el artículo, debajo la lista.
        -->
        <div v-else class="grid gap-10 lg:grid-cols-3 lg:items-start">
          <!-- article: contenido independiente, con sentido por sí mismo (HTML semántico) -->
          <article class="overflow-hidden rounded-xl border border-border bg-card lg:col-span-2">
            <img
              v-if="selectedArticle.imageUrl && !brokenImageIds.has(selectedArticle.id)"
              :src="selectedArticle.imageUrl"
              :alt="`Imagen de la noticia «${selectedArticle.title}»`"
              class="aspect-video w-full object-cover"
              loading="lazy"
              @error="hideBrokenImage(selectedArticle.id)"
            />
            <div class="p-6 md:p-8">
              <!-- time con datetime: la fecha legible por personas y por máquinas -->
              <time :datetime="selectedArticle.publishedAt" class="text-sm text-muted-foreground">
                {{ formatDate(selectedArticle.publishedAt) }}
              </time>
              <h3 class="mt-2 text-2xl">{{ selectedArticle.title }}</h3>
              <p class="mt-3 font-medium">{{ selectedArticle.summary }}</p>
              <!--
                whitespace-pre-line respeta los saltos de línea del texto.
                parseBold convierte **texto** en trozos: los marcados van en <strong>.
                Todo se pinta con {{ }} (texto escapado), nunca con v-html, para evitar XSS.
              -->
              <p class="mt-4 whitespace-pre-line text-muted-foreground"><template
                  v-for="(segment, index) in parseBold(selectedArticle.body)"
                  :key="index"
                ><strong v-if="segment.bold" class="font-semibold text-foreground">{{
                    segment.text
                  }}</strong><span v-else>{{ segment.text }}</span></template></p>
            </div>
          </article>

          <!--
            aside: contenido relacionado con el principal (HTML semántico).
            Solo tiene sentido si hay más de un artículo.
            lg:sticky: en escritorio la lista acompaña al leer artículos largos
            (top-24 deja hueco para la cabecera fija).
          -->
          <aside
            v-if="articles.length > 1"
            aria-labelledby="news-list-title"
            class="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24"
          >
            <h3 id="news-list-title" class="text-xl">Todas las noticias</h3>
            <ul class="mt-4 divide-y divide-border">
              <li v-for="article in articles" :key="article.id">
                <!--
                  Cada noticia enlaza a esta misma página con ?articulo=id.
                  aria-current="true" marca la que se está leyendo: lo anuncia el lector de pantalla
                  y, con la variante aria-[current=true]:, también cambia el fondo.
                  Se fija siempre (true o false) para no depender del marcado automático
                  de RouterLink: todos los enlaces apuntan a la misma ruta y solo cambia la query.
                -->
                <RouterLink
                  :to="{ name: 'resources-news', query: { articulo: article.id } }"
                  :aria-current="isSelected(article) ? 'true' : 'false'"
                  class="-mx-2 block rounded-md px-2 py-3 transition-colors hover:bg-secondary aria-[current=true]:bg-honey-soft"
                >
                  <time :datetime="article.publishedAt" class="text-xs text-muted-foreground">
                    {{ formatDate(article.publishedAt) }}
                  </time>
                  <span class="mt-1 block font-medium">{{ article.title }}</span>
                </RouterLink>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>

    <!-- Qué compartimos en redes -->
    <section class="mt-16" aria-labelledby="topics-title">
      <h2 id="topics-title" class="text-3xl">Síguenos en redes</h2>
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
        alt="Ahumador echando humo en primer plano, con un apicultor al fondo"
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