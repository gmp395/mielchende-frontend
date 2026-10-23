<script setup>
/*
 * Página de contacto: formulario, ubicación y redes sociales.
 * El correo del negocio no aparece en la web, para que no lo recojan los bots:
 * el visitante deja sus datos en el formulario, se guardan en el backend
 * y el admin los lee en el panel para responder.
 */
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { MapPin } from '@lucide/vue'
import { contactRepository } from '@/api/contactRepository'
import { LOCATION_LABEL, LOCATION_REFERENCE, MAPS_URL, SOCIAL_LINKS } from '@/constants/contact'
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_NAME_MAX_LENGTH,
  validateEmail,
  validateMaxLength,
  validateRequired,
} from '@/utils/validation'
import FormField from '@/components/common/FormField.vue'
import CaptchaWidget from '@/components/common/CaptchaWidget.vue'
import SocialIcon from '@/components/common/SocialIcon.vue'

/* Foto del apiario (carpeta public), enlazada con :src por la misma razón que en Inicio */
const CONTACT_IMAGE = '/images/content/apicultor-sacando-cuadro.jpg'

const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })

/* Token del captcha: lo rellena CaptchaWidget por v-model */
const captchaToken = ref('')
/* Referencia al componente del captcha, para pedir un reto nuevo tras cada envío */
const captcha = ref(null)

const isSubmitting = ref(false)
const serverError = ref('')
const successMessage = ref('')

/* Devuelve true si no hay errores */
function validate() {
  errors.name =
    validateRequired(form.name, 'Introduce tu nombre.') ||
    validateMaxLength(
      form.name,
      CONTACT_NAME_MAX_LENGTH,
      `El nombre no puede superar los ${CONTACT_NAME_MAX_LENGTH} caracteres.`,
    )
  errors.email = validateEmail(form.email)
  errors.message =
    validateRequired(form.message, 'Escribe tu mensaje.') ||
    validateMaxLength(
      form.message,
      CONTACT_MESSAGE_MAX_LENGTH,
      `El mensaje no puede superar los ${CONTACT_MESSAGE_MAX_LENGTH} caracteres.`,
    )
  return Object.values(errors).every((message) => !message)
}

async function handleSubmit() {
  serverError.value = ''
  successMessage.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    await contactRepository.send({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      captchaToken: captchaToken.value,
    })
    successMessage.value = 'Gracias por escribirnos. Te responderemos lo antes posible.'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (error) {
    serverError.value = error.message
  } finally {
    isSubmitting.value = false
    /* El token ya se ha usado (con éxito o no): pedimos un reto nuevo */
    captcha.value?.reset()
  }
}
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Contacto</p>
      <h1 class="mt-3 text-4xl">Hablemos</h1>
      <p class="mt-4 text-muted-foreground">
        ¿Tienes dudas sobre nuestra miel, quieres saber la disponibilidad de enjambres o reinas, o
        te interesa MiApiario? Escríbenos y te responderemos.
      </p>
    </header>

    <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
      <!-- Formulario de contacto -->
      <div class="rounded-xl border border-border bg-card p-6">
        <h2 class="text-xl">Escríbenos</h2>

        <!-- novalidate: desactiva los avisos nativos del navegador; validamos nosotros -->
        <form novalidate class="mt-5 space-y-5" @submit.prevent="handleSubmit">
          <FormField
            id="contact-name"
            v-model="form.name"
            label="Nombre"
            autocomplete="name"
            :error="errors.name"
          />
          <FormField
            id="contact-email"
            v-model="form.email"
            label="Email"
            type="email"
            autocomplete="email"
            :error="errors.email"
          />

          <!--
            Textarea con los mismos estilos y atributos de accesibilidad que FormField
            (FormField solo pinta inputs de una línea)
          -->
          <div>
            <label for="contact-message" class="block text-sm font-medium">Mensaje</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="6"
              :aria-invalid="errors.message ? 'true' : 'false'"
              :aria-describedby="errors.message ? 'contact-message-error' : undefined"
              class="mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
            ></textarea>
            <p
              v-if="errors.message"
              id="contact-message-error"
              class="mt-1.5 text-sm text-destructive"
            >
              {{ errors.message }}
            </p>
          </div>

          <CaptchaWidget ref="captcha" v-model="captchaToken" />

          <!-- role="alert": el lector de pantalla anuncia el error en cuanto aparece -->
          <p
            v-if="serverError"
            role="alert"
            class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {{ serverError }}
          </p>
          <!-- role="status": anuncia la confirmación sin interrumpir -->
          <p v-if="successMessage" role="status" class="rounded-md bg-secondary px-3 py-2 text-sm">
            {{ successMessage }}
          </p>

          <!-- Desactivado hasta superar el captcha: sin token, el backend lo rechazaría -->
          <button
            type="submit"
            :disabled="isSubmitting || !captchaToken"
            class="w-full rounded-md bg-primary px-4 py-3 text-base text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {{ isSubmitting ? 'Enviando…' : 'Enviar mensaje' }}
          </button>

          <p class="text-sm text-muted-foreground">
            Solo utilizaremos tus datos para atender tu consulta.
          </p>
        </form>
      </div>

      <!-- Ubicación, redes y foto del apiario -->
      <div class="space-y-6">
        <div class="flex gap-4 rounded-xl border border-border bg-card p-6">
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
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
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
        </div>

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
    </div>
  </section>
</template>