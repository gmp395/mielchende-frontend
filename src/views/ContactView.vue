<script setup>
/*
 * Página de contacto: correo, ubicación y redes sociales.
 * Es estática y sin formulario: un formulario necesitaría un endpoint
 * en el backend para recibir los mensajes (ampliación fuera del PMV).
 */
import { RouterLink } from 'vue-router'
import { Mail, MapPin } from '@lucide/vue'
import {
  CONTACT_EMAIL,
  LOCATION_LABEL,
  LOCATION_REFERENCE,
  MAPS_URL,
  SOCIAL_LINKS,
} from '@/constants/contact'
import SocialIcon from '@/components/common/SocialIcon.vue'

/* Foto del apiario (carpeta public), enlazada con :src por la misma razón que en Inicio */
const CONTACT_IMAGE = '/images/content/apicultor-sacando-cuadro.jpg'
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Contacto</p>
      <h1 class="mt-3 text-4xl">Hablemos</h1>
      <p class="mt-4 text-muted-foreground">
        ¿Tienes dudas sobre nuestra miel, quieres saber la disponibilidad de enjambres o reinas, o te
        interesa MiApiario? Escríbenos y te responderemos.
      </p>
    </header>

    <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
      <!-- Datos de contacto -->
      <ul class="space-y-6">
        <li class="flex gap-4 rounded-xl border border-border bg-card p-6">
          <Mail class="size-6 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 class="text-xl">Correo</h2>
            <a
              :href="`mailto:${CONTACT_EMAIL}`"
              class="mt-1 inline-block text-primary hover:underline"
            >
              {{ CONTACT_EMAIL }}
            </a>
          </div>
        </li>

        <li class="flex gap-4 rounded-xl border border-border bg-card p-6">
          <MapPin class="size-6 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 class="text-xl">Dónde estamos</h2>
            <p class="mt-1">{{ LOCATION_LABEL }}</p>
            <p class="text-sm text-muted-foreground">
              {{ LOCATION_REFERENCE }}, en la Reserva de la Biosfera Terras do Miño
            </p>
            <!-- Enlace externo: se abre en otra pestaña; noopener por seguridad -->
            <a
              :href="MAPS_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-block text-primary hover:underline"
            >
              Ver en Google Maps
            </a>
          </div>
        </li>

        <li class="rounded-xl border border-border bg-card p-6">
          <h2 class="text-xl">Síguenos</h2>
          <!-- Iconos redondos; el aria-label dice a qué red lleva cada uno -->
          <ul class="mt-3 flex gap-3">
            <li v-for="link in SOCIAL_LINKS" :key="link.icon">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.label"
                class="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <SocialIcon :icon="link.icon" class="size-5" />
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <!-- Foto del apiario y recordatorio de cómo pedir -->
      <div>
        <img
          :src="CONTACT_IMAGE"
          alt="Apicultor sacando un cuadro de la colmena"
          class="aspect-4/3 w-full rounded-xl object-cover"
          loading="lazy"
        />
        <p class="mt-4 text-sm text-muted-foreground">
          Para pedir miel u otros productos, haz tu solicitud desde el
          <RouterLink :to="{ name: 'catalog' }" class="text-primary hover:underline">
            catálogo</RouterLink
          >.
        </p>
      </div>
    </div>
  </section>
</template>