<script setup>
/*
 * Formulario de inicio de sesión.
 * Valida en el navegador, llama al store y emite "success" si todo va bien.
 * La vista que lo contiene decide a dónde navegar después.
 */
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validateRequired } from '@/utils/validation'
import FormField from '@/components/common/FormField.vue'

const emit = defineEmits(['success'])
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const serverError = ref('')
const isSubmitting = ref(false)

/* Devuelve true si no hay errores */
function validate() {
  errors.email = validateEmail(form.email)
  errors.password = validateRequired(form.password, 'Introduce tu contraseña.')
  return !errors.email && !errors.password
}

async function handleSubmit() {
  serverError.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    await authStore.login(form.email.trim(), form.password)
    emit('success')
  } catch (error) {
    /*
     * 401: mensaje genérico, sin decir si falla el email o la contraseña
     * (así no se revela qué emails están registrados).
     * Otros errores (servidor apagado, etc.): mensaje del ApiError.
     */
    serverError.value =
      error.status === 401 ? 'Email o contraseña incorrectos.' : error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- novalidate: desactiva los avisos nativos del navegador; validamos nosotros -->
  <form novalidate class="space-y-5" @submit.prevent="handleSubmit">
    <FormField
      id="login-email"
      v-model="form.email"
      label="Email"
      type="email"
      autocomplete="email"
      :error="errors.email"
    />
    <FormField
      id="login-password"
      v-model="form.password"
      label="Contraseña"
      type="password"
      autocomplete="current-password"
      :error="errors.password"
    />

    <!-- role="alert": el lector de pantalla anuncia el error en cuanto aparece -->
    <p v-if="serverError" role="alert" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {{ serverError }}
    </p>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full rounded-md bg-primary px-4 py-3 text-base text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {{ isSubmitting ? 'Entrando…' : 'Iniciar sesión' }}
    </button>
  </form>
</template>