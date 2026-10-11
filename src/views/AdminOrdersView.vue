<script setup>
/*
 * Panel de administración — Solicitudes.
 * Lista todas las solicitudes con un filtro por estado, muestra el resumen
 * de pendientes y permite avanzar o retroceder un paso en el estado.
 * Ruta protegida (requiresAdmin, heredado de la ruta padre /admin).
 */
import { ref, computed } from 'vue'
import { adminOrderRepository } from '@/api/adminOrderRepository'
import { ORDER_STATUS, ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '@/constants/orderStatus'
import AdminOrderCard from '@/components/admin/AdminOrderCard.vue'

/* Valor especial del filtro para ver todas las solicitudes */
const FILTER_ALL = 'ALL'

const orders = ref([])
const pendingOrders = ref(0)
const isLoading = ref(true)
const errorMessage = ref('')

/* Por defecto se ven las recibidas: coincide con "pendientes" del backend */
const selectedFilter = ref(ORDER_STATUS.RECEIVED)

/* Id de la solicitud que se está guardando (para desactivar sus botones) */
const updatingOrderId = ref(null)
/* Mensaje tras un cambio de estado: confirmación o aviso */
const actionMessage = ref('')
const actionIsError = ref(false)

/* Carga inicial: lista y resumen en paralelo */
async function loadData() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const [allOrders, summary] = await Promise.all([
      adminOrderRepository.getAll(),
      adminOrderRepository.getSummary(),
    ])
    orders.value = allOrders
    pendingOrders.value = summary.pendingOrders
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

/* Número de solicitudes en cada estado, para mostrarlo en el filtro */
const countsByStatus = computed(() => {
  const counts = Object.fromEntries(ORDER_STATUS_FLOW.map((status) => [status, 0]))
  for (const order of orders.value) {
    if (order.status in counts) counts[order.status]++
  }
  return counts
})

/* Opciones del filtro: un estado por paso del ciclo, más "Todas" */
const filterOptions = computed(() => [
  ...ORDER_STATUS_FLOW.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
    count: countsByStatus.value[status],
  })),
  { value: FILTER_ALL, label: 'Todas', count: orders.value.length },
])

/* Solicitudes visibles según el filtro elegido */
const filteredOrders = computed(() =>
  selectedFilter.value === FILTER_ALL
    ? orders.value
    : orders.value.filter((order) => order.status === selectedFilter.value),
)

/*
 * Respuesta al evento change-status de una tarjeta.
 * El backend es quien valida el cambio; aquí solo pedimos y reflejamos el resultado.
 */
async function changeStatus(order, newStatus) {
  updatingOrderId.value = order.id
  actionMessage.value = ''
  try {
    const updated = await adminOrderRepository.updateStatus(order.id, newStatus)
    /* Sustituimos solo esa solicitud por la versión que devuelve el backend */
    orders.value = orders.value.map((item) => (item.id === updated.id ? updated : item))
    /* "Pendiente" es una regla del backend: pedimos el resumen en vez de calcularlo */
    const summary = await adminOrderRepository.getSummary()
    pendingOrders.value = summary.pendingOrders
    actionIsError.value = false
    actionMessage.value = `Solicitud n.º ${updated.id} marcada como ${ORDER_STATUS_LABELS[updated.status]}.`
  } catch (error) {
    actionIsError.value = true
    actionMessage.value = error.message
    /* 409: el estado ya no coincide con el del backend, recargamos los datos */
    if (error.status === 409) await loadData()
  } finally {
    updatingOrderId.value = null
  }
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadData()
</script>

<template>
  <section>
    <h2 class="text-2xl">Solicitudes</h2>

    <!-- aria-live: el lector de pantalla anuncia carga, errores y confirmaciones -->
    <div class="mt-6" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando solicitudes…</p>

      <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="loadData"
        >
          Reintentar
        </button>
      </div>

      <template v-else>
        <!-- Resumen: dato calculado por el backend -->
        <p class="rounded-lg bg-secondary p-4">
          Solicitudes por revisar:
          <strong class="text-lg">{{ pendingOrders }}</strong>
        </p>

        <!--
          Filtro por estado. aria-pressed indica al lector de pantalla
          qué opción está activa, porque funcionan como botones de alternar.
        -->
        <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar solicitudes por estado">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            :aria-pressed="selectedFilter === option.value"
            :class="[
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              selectedFilter === option.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-secondary',
            ]"
            @click="selectedFilter = option.value"
          >
            {{ option.label }} ({{ option.count }})
          </button>
        </div>

        <!-- Confirmación o aviso tras un cambio de estado -->
        <p
          v-if="actionMessage"
          :role="actionIsError ? 'alert' : 'status'"
          :class="[
            'mt-6 rounded-lg p-4 text-sm',
            actionIsError ? 'bg-destructive/10 text-destructive' : 'bg-secondary',
          ]"
        >
          {{ actionMessage }}
        </p>

        <p v-if="filteredOrders.length === 0" class="mt-6 text-muted-foreground">
          No hay solicitudes en este estado.
        </p>

        <ul v-else class="mt-6 space-y-6">
          <li v-for="order in filteredOrders" :key="order.id">
            <AdminOrderCard
              :order="order"
              :is-updating="updatingOrderId === order.id"
              @change-status="(newStatus) => changeStatus(order, newStatus)"
            />
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>