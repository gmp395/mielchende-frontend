<script setup>
/*
 * Formulario de registro.
 * Valida en el navegador, crea la cuenta (el store inicia sesión automáticamente)
 * y emite "success" si todo va bien.
 * Incluye el captcha de Cloudflare Turnstile para frenar registros automáticos de bots.
 */
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  PASSWORD_MIN_LENGTH,
  validateEmail,
  validateNewPassword,
  validateRequired,
} from '@/utils/validation'
import FormField from '@/components/common/FormField.vue'
import CaptchaWidget from '@/components/common/CaptchaWidget.vue'

const emit = defineEmits(['success'])
const authStore = useAuthStore()

const form = reactive({ name: '', email: '', password: '', passwordConfirm: '' })
const errors = reactive({ name: '', email: '', password: '', passwordConfirm: '' })
const serverError = ref('')
const isSubmitting = ref(false)

/* Token del captcha: lo rellena CaptchaWidget por v-model */
const captchaToken = ref('')
/* Referencia al componente del captcha, para pedir un reto nuevo tras cada intento */
const captcha = ref(null)

/* Devuelve true si no hay errores */
function validate() {
  errors.name = validateRequired(form.name, 'Introduce tu nombre.')
  errors.email = validateEmail(form.email)
  errors.password = validateNewPassword(form.password)
  errors.passwordConfirm =
    form.passwordConfirm === form.password ? '' : 'Las contraseñas no coinciden.'
  return Object.values(errors).every((message) => !message)
}

async function handleSubmit() {
  serverError.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    await authStore.register(
      form.name.trim(),
      form.email.trim(),
      form.password,
      captchaToken.value,
    )
    emit('success')
  } catch (error) {
    /*
     * 409 (email ya registrado): no lo confirmamos explícitamente,
     * invitamos a iniciar sesión. 400: datos o captcha rechazados por el backend.
     */
    if (error.status === 409) {
      serverError.value = 'No se ha podido crear la cuenta. Si ya tienes una, inicia sesión.'
    } else if (error.status === 400) {
      serverError.value = 'Revisa los datos del formulario y vuelve a completar la verificación.'
    } else {
      serverError.value = error.message
    }
    /* El token ya se ha usado: pedimos un reto nuevo para el siguiente intento */
    captcha.value?.reset()
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- novalidate: desactiva los avisos nativos del navegador; validamos nosotros -->
  <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
    <FormField
      id="register-name"
      v-model="form.name"
      label="Nombre"
      autocomplete="name"
      :error="errors.name"
    />
    <FormField
      id="register-email"
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      :error="errors.email"
    />
    <FormField
      id="register-password"
      v-model="form.password"
      label="Contraseña"
      type="password"
      autocomplete="new-password"
      :hint="`Mínimo ${PASSWORD_MIN_LENGTH} caracteres.`"
      :error="errors.password"
    />
    <FormField
      id="register-password-confirm"
      v-model="form.passwordConfirm"
      label="Repite la contraseña"
      type="password"
      autocomplete="new-password"
      :error="errors.passwordConfirm"
    />

    <CaptchaWidget ref="captcha" v-model="captchaToken" />

    <!-- role="alert": el lector de pantalla anuncia el error en cuanto aparece -->
    <p v-if="serverError" role="alert" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {{ serverError }}
    </p>

    <!-- Desactivado hasta superar el captcha: sin token, el backend lo rechazaría -->
    <button
      type="submit"
      :disabled="isSubmitting || !captchaToken"
      class="w-full rounded-md bg-primary px-4 py-3 text-base text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {{ isSubmitting ? 'Creando cuenta…' : 'Crear cuenta' }}
    </button>
  </form>
</template>