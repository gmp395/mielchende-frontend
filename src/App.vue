<script setup>
/*
 * Componente raíz: define el layout común de todas las páginas.
 * Cabecera y pie fijos; en medio, la vista de la ruta activa.
 */
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>

<template>
  <!--
    min-h-screen + flex-col + flex-1 en main: si el contenido es corto,
    el pie se queda abajo del todo en lugar de subir a mitad de pantalla
  -->
  <div class="flex min-h-screen flex-col">
    <SiteHeader />

    <main class="flex-1">
      <RouterView />
    </main>

    <SiteFooter />
  </div>
</template>