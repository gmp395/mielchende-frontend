<script setup>
/*
 * Vista temporal "Próximamente".
 * Se usa para todas las secciones que aún no están construidas.
 * Lee el nombre de la sección desde meta.title de la ruta activa.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/* Nombre de la sección; si la ruta no lo define, se usa un texto genérico */
const sectionTitle = computed(() => route.meta.title ?? 'Esta sección')
</script>

<template>
  <section class="container-page py-24 text-center">
    <p class="eyebrow">Próximamente</p>
    <h1 class="mt-3 text-4xl">{{ sectionTitle }}</h1>
    <p class="mx-auto mt-4 max-w-md text-muted-foreground">
      Estamos preparando esta sección. Vuelve pronto.
    </p>
  </section>
</template>