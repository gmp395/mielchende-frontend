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

/* Correo real de contacto del negocio */
const CONTACT_EMAIL = 'apicolachende@gmail.com'

/* Perfil de GitHub de la autora del proyecto */
const AUTHOR_URL = 'https://github.com/gmp395'

/*
 * Redes sociales del negocio.
 * Si una URL está vacía, esa red no se muestra (así no publicamos enlaces falsos).
 * "icon" indica qué dibujo SVG se pinta en el template.
 */
const socialLinks = [
  { icon: 'instagram', label: 'Instagram de Miel Chende', url: 'https://www.instagram.com/apichende/' },
  { icon: 'facebook', label: 'Facebook de Miel Chende', url: 'https://www.facebook.com/apicola.chende' },
  {
    icon: 'youtube',
    label: 'Canal de YouTube de Miel Chende',
    url: 'https://www.youtube.com/@apicolachende1554',
  },
].filter((link) => link.url)

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

        <!--
          Redes sociales: solo se muestra la fila si hay alguna URL real.
          Iconos de línea (estilo Lucide), coherentes con los de la cabecera.
          stroke="currentColor" hace que el icono tome el color del texto,
          así el hover:text-primary también lo colorea.
        -->
        <ul v-if="socialLinks.length" class="mt-3 flex gap-3 text-muted-foreground">
          <li v-for="link in socialLinks" :key="link.icon">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
              class="transition-colors hover:text-primary"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-5"
                aria-hidden="true"
              >
                <!-- Instagram -->
                <template v-if="link.icon === 'instagram'">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </template>
                <!-- Facebook -->
                <template v-else-if="link.icon === 'facebook'">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </template>
                <!-- YouTube -->
                <template v-else-if="link.icon === 'youtube'">
                  <path
                    d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
                  />
                  <path d="m10 15 5-3-5-3z" />
                </template>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <!-- Contacto -->
      <div>
        <p class="eyebrow">Contacto</p>
        <ul class="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li>Cospeito, Lugo (Galicia)</li>
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