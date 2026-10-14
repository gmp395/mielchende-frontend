<script setup>
/*
 * Panel de administración — Contenidos (artículos de Actualidad).
 * Lista todos los artículos, borradores incluidos, y permite crearlos,
 * editarlos y publicarlos o despublicarlos.
 * No hay borrado: para retirar un artículo de la web se vuelve a borrador.
 * Ruta protegida (requiresAdmin, heredado de la ruta padre /admin).
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminArticleRepository } from '@/api/adminArticleRepository'
import { ARTICLE_STATUS, ARTICLE_STATUS_LABELS } from '@/constants/articleStatus'
import { formatDate } from '@/utils/format'

const articles = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

/* Id del artículo cuyo estado se está guardando (para desactivar su botón) */
const updatingArticleId = ref(null)

/* Mensaje tras una acción: confirmación o aviso */
const actionMessage = ref('')
const actionIsError = ref(false)

async function loadArticles() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    articles.value = await adminArticleRepository.getAll()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

function showMessage(message, isError = false) {
  actionMessage.value = message
  actionIsError.value = isError
}

/* true si el artículo está publicado (lo usan el botón y la fecha) */
function isPublished(article) {
  return article.status === ARTICLE_STATUS.PUBLISHED
}

/*
 * Publica un borrador o despublica un artículo publicado (PATCH).
 * Se sustituye el artículo por la versión que devuelve el backend,
 * que ya trae la fecha de publicación actualizada.
 */
async function togglePublish(article) {
  const newStatus = isPublished(article) ? ARTICLE_STATUS.DRAFT : ARTICLE_STATUS.PUBLISHED
  updatingArticleId.value = article.id
  try {
    const updated = await adminArticleRepository.updateStatus(article.id, newStatus)
    articles.value = articles.value.map((item) => (item.id === updated.id ? updated : item))
    showMessage(`«${updated.title}»: ${ARTICLE_STATUS_LABELS[updated.status]}.`)
  } catch (error) {
    showMessage(error.message, true)
  } finally {
    updatingArticleId.value = null
  }
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadArticles()
</script>

<template>
  <section>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl">Contenidos</h2>
        <p class="mt-1 text-sm text-muted-foreground">
          Artículos de Actualidad. Solo los publicados se ven en la web.
        </p>
      </div>
      <RouterLink
        :to="{ name: 'admin-article-new' }"
        class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
      >
        Nuevo artículo
      </RouterLink>
    </div>

    <!-- aria-live: el lector de pantalla anuncia carga, errores y confirmaciones -->
    <div class="mt-6" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando artículos…</p>

      <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="loadArticles"
        >
          Reintentar
        </button>
      </div>

      <template v-else>
        <div
          v-if="actionMessage"
          :role="actionIsError ? 'alert' : 'status'"
          :class="[
            'mb-6 rounded-lg p-4 text-sm',
            actionIsError ? 'bg-destructive/10 text-destructive' : 'bg-secondary',
          ]"
        >
          <p>{{ actionMessage }}</p>
        </div>

        <p v-if="articles.length === 0" class="text-muted-foreground">
          Todavía no hay artículos. Crea el primero con «Nuevo artículo».
        </p>

        <ul v-else class="divide-y divide-border rounded-xl border border-border bg-card">
          <li
            v-for="article in articles"
            :key="article.id"
            class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div class="min-w-0 flex-1">
              <p class="font-medium">{{ article.title }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <!-- Estado: texto visible, no solo color, para que se entienda sin verlo -->
                <span
                  :class="[
                    'rounded-full border px-2.5 py-0.5 text-xs',
                    isPublished(article)
                      ? 'border-primary/40 bg-honey-soft text-foreground'
                      : 'border-border bg-secondary text-foreground',
                  ]"
                >
                  {{ ARTICLE_STATUS_LABELS[article.status] }}
                </span>
                <span v-if="isPublished(article)">
                  Publicado el {{ formatDate(article.publishedAt) }}
                </span>
                <span v-else>Creado el {{ formatDate(article.createdAt) }}</span>
              </div>
            </div>

            <!--
              Acciones. El aria-label incluye el título, porque con varias filas
              un lector de pantalla oiría muchos botones con el mismo texto.
            -->
            <div class="flex flex-wrap gap-2">
              <RouterLink
                :to="{ name: 'admin-article-edit', params: { id: article.id } }"
                class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                :aria-label="`Editar «${article.title}»`"
              >
                Editar
              </RouterLink>
              <button
                type="button"
                class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary disabled:opacity-50"
                :disabled="updatingArticleId === article.id"
                :aria-label="`${isPublished(article) ? 'Despublicar' : 'Publicar'} «${article.title}»`"
                @click="togglePublish(article)"
              >
                {{ isPublished(article) ? 'Despublicar' : 'Publicar' }}
              </button>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>