<script setup>
/*
 * Pie común de la web: logo, presentación, redes, contacto,
 * copyright, autoría y enlaces legales.
 * La navegación no se repite aquí porque la cabecera es fija (sticky)
 * y siempre está visible.
 */
import { RouterLink } from 'vue-router'
/* Logo importado desde assets: Vite lo procesa y los tests lo resuelven */
import logoUrl from '@/assets/images/logo.png'
/* Datos de contacto compartidos con la página de Contacto */
import { CONTACT_EMAIL, LOCATION_LABEL, SOCIAL_LINKS } from '@/constants/contact'
import SocialIcon from '@/components/common/SocialIcon.vue'

/* Perfil de GitHub de la autora del proyecto */
const AUTHOR_URL = 'https://github.com/gmp395'

/* Año actual para el copyright (se actualiza solo cada año) */
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-border bg-sand">
    <!--
      Franja principal a todo el ancho: en móvil, bloques apilados;
      desde sm, una sola fila (presentación a la izquierda, contacto a la derecha)
    -->
    <div
      class="flex w-full flex-col gap-5 px-5 py-5 sm:flex-row sm:items-start sm:justify-between md:px-10"
    >
      <!-- Presentación: logo, descripción y redes -->
      <div>
        <!--
          :src enlaza con la variable logoUrl (importada arriba).
          alt="" porque la imagen es decorativa: el nombre ya está escrito al lado
        -->
        <p class="flex items-center gap-2 font-display text-lg">
          <img :src="logoUrl" alt="" class="size-7" />
          <span>Miel <span class="text-primary">Chende</span></span>
        </p>
        <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Proyecto apícola familiar en Cospeito, dentro de la Reserva de la Biosfera Terras do Miño.
        </p>

        <!-- Redes sociales: solo se muestra la fila si hay alguna URL real -->
        <ul v-if="SOCIAL_LINKS.length" class="mt-3 flex gap-3 text-muted-foreground">
          <li v-for="link in SOCIAL_LINKS" :key="link.icon">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
              class="transition-colors hover:text-primary"
            >
              <SocialIcon :icon="link.icon" class="size-5" />
            </a>
          </li>
        </ul>
      </div>

      <!-- Contacto: el título lleva a la página de contacto completa -->
      <div>
        <RouterLink
          :to="{ name: 'contact' }"
          class="eyebrow transition-colors hover:text-primary"
        >
          Contacto
        </RouterLink>
        <ul class="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>{{ LOCATION_LABEL }}</li>
          <li>
            <a :href="`mailto:${CONTACT_EMAIL}`" class="hover:text-primary">{{ CONTACT_EMAIL }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Franja inferior a todo el ancho: copyright, autoría y enlaces legales -->
    <div class="border-t border-border/80">
      <div
        class="flex w-full flex-col gap-2 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10"
      >
        <div class="flex flex-col gap-1 sm:flex-row sm:gap-4">
          <p>© {{ currentYear }} Miel Chende. Todos los derechos reservados.</p>
          <p>
            Diseño y desarrollo:
            <a :href="AUTHOR_URL" target="_blank" rel="noopener noreferrer" class="hover:text-primary">
              Gema Miguel
            </a>
          </p>
        </div>
        <div class="flex flex-wrap gap-5">
          <RouterLink to="/aviso-legal" class="hover:text-primary">Aviso legal</RouterLink>
          <RouterLink to="/privacidad" class="hover:text-primary">Política de privacidad</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>