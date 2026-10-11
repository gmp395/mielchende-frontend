# Miel Chende · Frontend

Web de **Miel Chende**, de Apícola Chende, una explotación apícola familiar de Cospeito (Lugo), en la Reserva de la Biosfera Terras do Miño.

Proyecto final individual del bootcamp de desarrollo web full stack de Factoría F5 y, a la vez, una aplicación real para el negocio familiar.

El backend está en [mielchende-backend](https://github.com/gmp395/mielchende-backend).

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Capturas](#capturas)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Diseño](#diseño)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Testing](#testing)
- [Accesibilidad](#accesibilidad)
- [Decisiones técnicas](#decisiones-técnicas)
- [Próximos pasos](#próximos-pasos)
- [Autora](#autora)

## Descripción

Apícola Chende produce miel artesanal con **una sola cosecha al año**. Por eso la web no es una tienda online: el cliente envía una **solicitud de pedido** y el apicultor la gestiona a mano, sin carrito ni pasarela de pago.

Este repositorio contiene la aplicación en Vue que consume la [API del backend](https://github.com/gmp395/mielchende-backend). Es *responsive*: está pensada para móvil y escritorio.

## Funcionalidades

### Visitante

- Catálogo y ficha de cada producto, con su disponibilidad (disponible o agotado hasta la próxima cosecha).
- Registro e inicio de sesión en una misma vista con dos pestañas.
- Las secciones todavía no construidas muestran una vista "Próximamente".

### Cliente

- **Solicitud de pedido** con varios productos, teléfono y comentarios opcionales.
- **Mis solicitudes**: historial con el estado de cada solicitud (Recibido → Confirmado → Enviado).

### Administrador

- **Solicitudes**: listado de todas las solicitudes, resumen de pendientes, filtro por estado y cambio de estado un paso adelante o atrás.
- **Productos**: alta, edición, cambio de disponibilidad con un clic y borrado con confirmación. Si un producto tiene solicitudes, no se puede borrar y se ofrece marcarlo como agotado.

## Capturas

<!-- Pendiente: capturas de las pantallas principales en móvil y escritorio -->

## Tecnologías

| Ámbito | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API con `<script setup>`), en JavaScript |
| Herramienta de construcción | Vite |
| Enrutado | Vue Router |
| Estado global | Pinia |
| Estilos | Tailwind CSS 4 |
| Iconos | Lucide |
| Tests unitarios y de componentes | Vitest y Vue Test Utils |
| Tests end-to-end | Playwright |
| Calidad de código | ESLint, Oxlint y Prettier |

## Arquitectura

Ningún componente llama a la API directamente. Las peticiones siguen siempre la misma cadena: **Componente → Repositorio → `httpClient` → API**.

```
src
├── api/          httpClient (único punto de acceso a la API) y repositorios
├── components/   Componentes por funcionalidad: layout, auth, catalog, orders, admin, common
├── constants/    Estados y sus etiquetas (nada escrito a mano en las vistas)
├── mappers/      Traducción entre formularios y DTOs de la API
├── router/       Rutas y guards de navegación
├── stores/       Store de autenticación (Pinia)
├── utils/        Validaciones, formato de precios y fechas, y lógica pura
└── views/        Una vista por pantalla
```

- **`httpClient`**: añade el token (`Authorization: Bearer`), convierte cualquier error en un `ApiError` uniforme y, ante un 401, cierra la sesión y redirige al login.
- **Repositorios** (`productRepository`, `orderRepository`, `adminOrderRepository`...): un método por endpoint, siguiendo el *Repository Pattern*.
- **Mappers**: traducen entre los datos del formulario y el formato que espera la API. Si el backend cambiara un nombre de campo, solo habría que tocar el mapper.
- **Store `auth`**: el token es la única fuente de verdad; el email y los roles se obtienen decodificando el JWT.
- **Guards del router**: `requiresAuth`, `requiresAdmin` y `guestOnly`. Las rutas del panel heredan `requiresAdmin` de la ruta padre `/admin`. Son una ayuda para la experiencia de usuario: la seguridad real la aplica el backend.

## Diseño

El diseño partió de una referencia generada con IA y se trasladó a [Figma](https://www.figma.com/design/uWlhx5mhzDOsoaN3hQbVDj/Miel-chende), con versiones de escritorio y móvil. Los colores y las fuentes se definen como variables de tema de Tailwind en `src/assets/styles/main.css`.

## Instalación y puesta en marcha

### Requisitos

- [Node.js](https://nodejs.org/) 22.18 o superior (o 24.12 o superior)
- El [backend](https://github.com/gmp395/mielchende-backend) en marcha en `http://localhost:8081`. Su README explica cómo arrancarlo.

### 1. Clonar el repositorio e instalar las dependencias

```bash
git clone https://github.com/gmp395/mielchende-frontend.git
cd mielchende-frontend
npm install
```

### 2. Crear el archivo `.env`

```bash
cp .env.example .env
```

Contiene la URL de la API (`VITE_API_URL=http://localhost:8081/api`). Si el backend está en el puerto por defecto, no hay que cambiar nada.

### 3. Arrancar la aplicación

```bash
npm run dev
```

La web queda disponible en **`http://localhost:5173`**.

### Acceso como administrador

La cuenta de administrador la crea el backend en su primer arranque, con los datos de `ADMIN_EMAIL` y `ADMIN_PASSWORD` de **su** `.env`. Con esa cuenta, el menú de usuario muestra el enlace al **Panel de administración**.

## Testing

### Tests unitarios y de componentes

```bash
npx vitest run
```

(`npm run test:unit` los ejecuta en modo vigilancia: se repiten cada vez que se guarda un archivo.)

Cubren las utilidades (validaciones, formato, ciclo de estados), los mappers, el `httpClient`, el store de autenticación, los guards del router y las vistas. En los tests de vistas, los repositorios se sustituyen por *mocks*, así que no necesitan el backend.

### Tests end-to-end

Se ejecutan en un navegador real **contra el backend real**, sin respuestas simuladas, para comprobar que frontend y backend encajan de verdad.

**La primera vez**, instala los navegadores de Playwright:

```bash
npx playwright install
```

Después, con Docker, el backend y el frontend en marcha:

```bash
npx playwright test --project=chromium
```

El recorrido principal registra un cliente nuevo, solicita un producto y comprueba que aparece en "Mis solicitudes". Cada ejecución deja en la base de datos un usuario y una solicitud de prueba, reconocibles por su email (`e2e-...@test.com`).

## Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `footer`, listas, `fieldset` y `legend`).
- Formularios con `label` asociada a cada campo y errores enlazados con `aria-describedby` y `aria-invalid`.
- Al enviar un formulario con errores, el foco va al primer campo con error.
- Diálogos con `role="dialog"` y `aria-modal`, foco inicial en la opción segura y cierre con Escape.
- Avisos y estados de carga anunciados con `aria-live`, `role="status"` y `role="alert"`.
- Botones repetidos con `aria-label` que incluye a qué elemento se refieren.

## Decisiones técnicas

- **Solicitud de pedido en lugar de compra online**, por el modelo real del negocio.
- **JavaScript en lugar de TypeScript**, para centrar el proyecto en Vue y en la arquitectura.
- **Un único cliente HTTP** con gestión uniforme de errores y del 401.
- **Pinia** para el estado global, con el token como única fuente de verdad.
- **Etiquetas de estado en constantes** y transformaciones (precios, fechas) fuera de las vistas.
- **Una sola vista de acceso** con pestañas, y **un solo formulario** para crear y editar productos.
- **El precio se escribe con coma o punto**, como es natural en español, y el mapper lo convierte a número.
- **Imagen por defecto** para los productos sin imagen o con un enlace roto.
- **E2E contra el backend real**, en lugar de simular la API.

## Próximos pasos

- **Categorías de producto** y filtro en el catálogo, incluida la categoría "Para apicultores" (enjambres y reinas) con consulta de disponibilidad.
- **Secciones de contenido**: inicio, historia, mundo de las abejas, formación apícola y contacto.
- **Recorrido E2E del administrador.**
- **Despliegue** en un servidor con HTTPS.

## Autora

**Gema Miguel** · [GitHub](https://github.com/gmp395)