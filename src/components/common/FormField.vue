<script setup>
/*
 * Campo de formulario reutilizable: etiqueta + input + mensaje de error o ayuda.
 * defineModel permite usarlo con v-model desde el componente padre,
 * igual que un input normal.
 * Si el campo es de tipo contraseña, muestra un botón para ver u ocultar el texto.
 */
import { computed, ref } from 'vue'
import { Eye, EyeOff } from '@lucide/vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'off' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
})

const model = defineModel({ type: String, default: '' })

/* true si el campo es de contraseña (solo entonces se muestra el ojo) */
const isPassword = computed(() => props.type === 'password')

/* Estado del ojo: contraseña visible u oculta */
const isPasswordVisible = ref(false)

/*
 * Tipo real del input: si es contraseña y está visible, pasa a "text"
 * para que se lea; en cualquier otro caso, el tipo recibido por props.
 */
const inputType = computed(() =>
  isPassword.value && isPasswordVisible.value ? 'text' : props.type,
)

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div>
    <!-- for/id: al pulsar la etiqueta se enfoca el campo, y el lector de pantalla los asocia -->
    <label :for="id" class="block text-sm font-medium">{{ label }}</label>

    <!-- relative: permite colocar el botón del ojo dentro de la caja, a la derecha -->
    <div class="relative mt-1.5">
      <!--
        aria-invalid: indica al lector de pantalla que el campo tiene un error.
        aria-describedby: enlaza el campo con el texto de error o de ayuda.
        aria-invalid:border-destructive: borde rojo cuando aria-invalid="true".
        pr-12 (solo en contraseñas): deja hueco a la derecha para el botón.
      -->
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        :class="[
          'block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive',
          { 'pr-12': isPassword },
        ]"
      />

      <!--
        Botón del ojo, solo en campos de contraseña.
        El icono muestra el estado actual: ojo abierto = contraseña visible,
        ojo tachado = contraseña oculta.
        type="button": no envía el formulario al pulsarlo.
        aria-label y aria-pressed: el lector de pantalla sabe qué hace y en qué estado está.
      -->
      <button
        v-if="isPassword"
        type="button"
        :aria-label="isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        :aria-pressed="isPasswordVisible"
        :aria-controls="id"
        class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground"
        @click="togglePasswordVisibility"
      >
        <Eye v-if="isPasswordVisible" class="size-5" aria-hidden="true" />
        <EyeOff v-else class="size-5" aria-hidden="true" />
      </button>
    </div>

    <p v-if="error" :id="`${id}-error`" class="mt-1.5 text-sm text-destructive">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="mt-1.5 text-sm text-muted-foreground">
      {{ hint }}
    </p>
  </div>
</template>