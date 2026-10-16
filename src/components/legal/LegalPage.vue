<script setup>
/*
 * Plantilla común de las páginas legales (aviso legal y privacidad).
 * Cada vista solo le pasa el título, la introducción y las secciones.
 * Cada sección: { id, title, paragraphs?, items? }
 */
import { IS_LEGAL_DRAFT, LEGAL_INFO } from '@/constants/legal'

defineProps({
  title: { type: String, required: true },
  intro: { type: String, default: '' },
  sections: { type: Array, required: true },
})
</script>

<template>
  <section class="container-page max-w-3xl py-16">
    <header>
      <p class="eyebrow">Información legal</p>
      <h1 class="mt-3 text-4xl">{{ title }}</h1>
      <p v-if="intro" class="mt-4 text-muted-foreground">{{ intro }}</p>
      <p class="mt-2 text-sm text-muted-foreground">
        Última actualización: {{ LEGAL_INFO.lastUpdated }}
      </p>
    </header>

    <!-- Aviso visible mientras los datos del titular sean de ejemplo -->
    <p v-if="IS_LEGAL_DRAFT" role="note" class="mt-8 rounded-md bg-secondary px-4 py-3 text-sm">
      Texto provisional: los datos entre corchetes son de ejemplo y se completarán antes de
      publicar la web.
    </p>

    <!-- Una sección por apartado; aria-labelledby la relaciona con su título -->
    <section
      v-for="section in sections"
      :key="section.id"
      :aria-labelledby="`${section.id}-title`"
      class="mt-10"
    >
      <h2 :id="`${section.id}-title`" class="text-2xl">{{ section.title }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph" class="mt-3 text-muted-foreground">
        {{ paragraph }}
      </p>
      <ul v-if="section.items" class="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
        <li v-for="item in section.items" :key="item">{{ item }}</li>
      </ul>
    </section>
  </section>
</template>