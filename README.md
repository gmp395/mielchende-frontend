# Miel Chende · Frontend

Web de **Miel Chende**, de Apícola Chende, una explotación apícola familiar de Cospeito (Lugo), en la Reserva de la Biosfera Terras do Miño.

Proyecto final individual del bootcamp de desarrollo web full stack de Factoría F5 y, a la vez, una aplicación real para el negocio familiar.

El backend está en [mielchende-backend](https://github.com/gmp395/mielchende-backend).

La presentación del proyecto está en [Canva](https://canva.link/o9bquznrnbz66sf).

El diseño (wireframes, iteración con Lovable y mockups de la web final) está en [Figma](https://www.figma.com/design/uWlhx5mhzDOsoaN3hQbVDj/Miel-chende).

La documentación ampliada está en la [wiki](https://github.com/gmp395/mielchende-frontend/wiki).

## Índice

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Capturas](#capturas)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Diseño](#diseño)
- [Gestión del proyecto](#gestión-del-proyecto)
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

- **Inicio** con la presentación del apiario y acceso al catálogo.
- **Catálogo** con filtro por categorías (Mieles, Otros productos de la colmena y Para el apicultor) y **ficha** de cada producto, con su disponibilidad (disponible, próximamente o agotado hasta la próxima cosecha).
- **Contacto**: formulario protegido con captcha, cuyos mensajes llegan al panel de administración, ubicación de referencia con enlace a Google Maps y redes sociales. La web no publica ningún correo electrónico.
- **Recursos apícolas**, con fotos reales del apiario:
  - **Actualidad apícola**, en formato periódico: el artículo seleccionado se lee en grande y el resto aparece en una columna lateral. Son las noticias que el administrador publica desde el panel (por ejemplo, la agenda de ferias del sector), con negritas en el texto.
  - **Calendario apícola**, **Mundo de las abejas**, **Amenazas para las abejas** y **Guías prácticas**.
- Registro (protegido con captcha) e inicio de sesión en una misma vista con dos pestañas.
- **Aviso legal** y **política de privacidad**.

### Cliente

- **Solicitud de pedido** con varios productos, teléfono y comentarios opcionales, e información sobre las formas de pago (Bizum o transferencia, sin pago online).
- **Mis solicitudes**: historial con el estado de cada solicitud (Recibido → Confirmado → Enviado).

### Administrador

- **Solicitudes**: listado de todas las solicitudes, resumen de pendientes, filtro por estado y cambio de estado un paso adelante o atrás.
- **Productos**: alta, edición, cambio de disponibilidad y borrado con confirmación. Si un producto tiene solicitudes, no se puede borrar y se ofrece marcarlo como agotado.
- **Contenidos**: artículos de Actualidad. Se crean como borrador, se editan y se publican o despublican; no se borran. Solo los publicados se ven en la web.
- **Mensajes**: los mensajes del formulario de contacto, del más reciente al más antiguo, con un enlace para responder por correo.

## Capturas

Las miniaturas se pueden pulsar para ver la captura a tamaño completo.

### Parte pública

| Inicio | Catálogo | Ficha de producto |
|---|---|---|
| [<img src="docs/screenshots/inicio.png" width="250" alt="Página de inicio">](docs/screenshots/inicio.png) | [<img src="docs/screenshots/catalogo.png" width="250" alt="Catálogo con filtro por categorías">](docs/screenshots/catalogo.png) | [<img src="docs/screenshots/detalle-producto.png" width="250" alt="Ficha de un producto">](docs/screenshots/detalle-producto.png) |

| Actualidad apícola | Calendario apícola | Mundo de las abejas |
|---|---|---|
| [<img src="docs/screenshots/actualidad.png" width="250" alt="Actualidad apícola en formato periódico">](docs/screenshots/actualidad.png) | [<img src="docs/screenshots/calendario.png" width="250" alt="Calendario apícola">](docs/screenshots/calendario.png) | [<img src="docs/screenshots/mundo-abejas.png" width="250" alt="Mundo de las abejas">](docs/screenshots/mundo-abejas.png) |

| Amenazas para las abejas | Guías prácticas | Contacto |
|---|---|---|
| [<img src="docs/screenshots/amenazas.png" width="250" alt="Amenazas para las abejas">](docs/screenshots/amenazas.png) | [<img src="docs/screenshots/guias.png" width="250" alt="Guías prácticas">](docs/screenshots/guias.png) | [<img src="docs/screenshots/contacto.png" width="250" alt="Formulario de contacto con captcha">](docs/screenshots/contacto.png) |

| Aviso legal | Política de privacidad |
|---|---|
| [<img src="docs/screenshots/aviso-legal.png" width="250" alt="Aviso legal">](docs/screenshots/aviso-legal.png) | [<img src="docs/screenshots/privacidad.png" width="250" alt="Política de privacidad">](docs/screenshots/privacidad.png) |

### Cliente

| Inicio de sesión | Registro | Solicitud de pedido | Mis solicitudes |
|---|---|---|---|
| [<img src="docs/screenshots/login.png" width="200" alt="Pestaña de inicio de sesión">](docs/screenshots/login.png) | [<img src="docs/screenshots/registro.png" width="200" alt="Pestaña de registro con captcha">](docs/screenshots/registro.png) | [<img src="docs/screenshots/solicitud.png" width="200" alt="Formulario de solicitud de pedido">](docs/screenshots/solicitud.png) | [<img src="docs/screenshots/mis-solicitudes.png" width="200" alt="Historial de solicitudes con su estado">](docs/screenshots/mis-solicitudes.png) |

### Panel de administración

| Solicitudes | Productos | Contenidos | Mensajes |
|---|---|---|---|
| [<img src="docs/screenshots/admin-solicitudes.png" width="200" alt="Panel: solicitudes">](docs/screenshots/admin-solicitudes.png) | [<img src="docs/screenshots/admin-productos.png" width="200" alt="Panel: productos">](docs/screenshots/admin-productos.png) | [<img src="docs/screenshots/admin-contenidos.png" width="200" alt="Panel: artículos de Actualidad">](docs/screenshots/admin-contenidos.png) | [<img src="docs/screenshots/admin-mensajes.png" width="200" alt="Panel: mensajes de contacto">](docs/screenshots/admin-mensajes.png) |

### Móvil

| Inicio | Catálogo | Actualidad | Calendario |
|---|---|---|---|
| [<img src="docs/screenshots/movil-inicio.png" width="160" alt="Inicio en móvil">](docs/screenshots/movil-inicio.png) | [<img src="docs/screenshots/movil-catalogo.png" width="160" alt="Catálogo en móvil">](docs/screenshots/movil-catalogo.png) | [<img src="docs/screenshots/movil-actualidad.png" width="160" alt="Actualidad en móvil">](docs/screenshots/movil-actualidad.png) | [<img src="docs/screenshots/movil-calendario.png" width="160" alt="Calendario en móvil">](docs/screenshots/movil-calendario.png) |

| Mundo de las abejas | Amenazas | Guías | Contacto |
|---|---|---|---|
| [<img src="docs/screenshots/movil-mundo-abejas.png" width="160" alt="Mundo de las abejas en móvil">](docs/screenshots/movil-mundo-abejas.png) | [<img src="docs/screenshots/movil-amenazas.png" width="160" alt="Amenazas en móvil">](docs/screenshots/movil-amenazas.png) | [<img src="docs/screenshots/movil-guias.png" width="160" alt="Guías en móvil">](docs/screenshots/movil-guias.png) | [<img src="docs/screenshots/movil-contacto.png" width="160" alt="Contacto en móvil">](docs/screenshots/movil-contacto.png) |

## Tecnologías

| Ámbito | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API con `<script setup>`), en JavaScript |
| Herramienta de construcción | Vite |
| Enrutado | Vue Router |
| Estado global | Pinia |
| Estilos | Tailwind CSS 4 |
| Iconos | Lucide |
| Captcha | Cloudflare Turnstile |
| Tests unitarios y de componentes | Vitest y Vue Test Utils |
| Tests end-to-end | Playwright |
| Calidad de código | ESLint, Oxlint y Prettier |

## Arquitectura

Ningún componente llama a la API directamente. Las peticiones siguen siempre la misma cadena: **Componente → Repositorio → `httpClient` → API**.

```mermaid
flowchart LR
    V["Vistas y componentes<br/>(views, components)"]
    M["Mappers<br/>formulario ⇄ DTO"]
    R["Repositorios<br/>un método por endpoint"]
    H["httpClient<br/>token, errores y 401"]
    API[("API REST<br/>Spring Boot")]
    S["Store auth (Pinia)<br/>token y roles"]
    G["Router<br/>guards de navegación"]

    V --> M
    V --> R
    R --> H
    H -- "fetch + Bearer" --> API
    V --> S
    G --> S
    S -. "validToken (main.js)" .-> H
    H -. "401: logout (main.js)" .-> S
```

**Cómo leerlo:** las flechas continuas son dependencias directas (quién llama a quién). Las discontinuas son las dos funciones que `main.js` inyecta en el `httpClient`, para que este no dependa del store: de dónde sacar el token y qué hacer ante un 401.

```
src
├── api/          httpClient (único punto de acceso a la API) y repositorios
├── components/   Componentes por funcionalidad: layout, auth, catalog, orders, admin, common
├── constants/    Estados y categorías con sus etiquetas (nada escrito a mano en las vistas)
├── mappers/      Traducción entre formularios y DTOs de la API
├── router/       Rutas y guards de navegación
├── stores/       Store de autenticación (Pinia)
├── utils/        Validaciones, formato, negritas en artículos y lógica pura
└── views/        Una vista por pantalla
```

- **`httpClient`**: añade el token (`Authorization: Bearer`) solo si la sesión es válida, convierte cualquier error en un `ApiError` uniforme y, ante un 401, cierra la sesión y redirige al login. Acepta también respuestas correctas sin cuerpo (201 y 204).
- **Repositorios** (`productRepository`, `orderRepository`, `contactRepository`, `adminArticleRepository`...): un método por endpoint, siguiendo el *Repository Pattern*.
- **Mappers**: traducen entre los datos del formulario y el formato que espera la API. Si el backend cambiara un nombre de campo, solo habría que tocar el mapper.
- **Store `auth`**: el token es la única fuente de verdad; el email, los roles y la caducidad se obtienen decodificando el JWT. El getter `validToken` devuelve el token solo si no ha caducado.
- **Guards del router**: `requiresAuth`, `requiresAdmin` y `guestOnly`. Las rutas del panel heredan `requiresAdmin` de la ruta padre `/admin`. Son una ayuda para la experiencia de usuario: la seguridad real la aplica el backend.
- **`CaptchaWidget`**: carga el script de Cloudflare Turnstile una sola vez, pinta el reto y entrega el token al formulario por `v-model`. El token solo demuestra que se ha superado el reto: quien lo verifica es el backend, con la clave secreta.

## Diseño

El diseño partió de una referencia generada con IA y se trasladó a [Figma](https://www.figma.com/design/uWlhx5mhzDOsoaN3hQbVDj/Miel-chende), con versiones de escritorio y móvil. Los colores y las fuentes se definen como variables de tema de Tailwind en `src/assets/styles/main.css`.

## Gestión del proyecto

El proyecto se ha organizado en Jira con épicas, historias de usuario con criterios de aceptación y sprints. Las ampliaciones que quedaron fuera del alcance se registraron como historias nuevas en lugar de descartarse.

[<img src="docs/screenshots/jira.png" width="500" alt="Tablero del proyecto en Jira">](docs/screenshots/jira.png)

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

Contiene dos variables:

| Variable | Para qué sirve |
|---|---|
| `VITE_API_URL` | URL de la API (`http://localhost:8081/api`). Si el backend está en el puerto por defecto, no hay que cambiarla. |
| `VITE_TURNSTILE_SITE_KEY` | Clave pública del captcha. El ejemplo trae la **clave de prueba de Cloudflare**: muestra el reto con un aviso de pruebas y siempre lo da por superado. Debe ir emparejada con la clave secreta de prueba en el `.env` del backend. |

Para usar claves reales, se crea un widget en el panel de Cloudflare Turnstile con el dominio de la web (`localhost` en desarrollo). La clave pública va en este `.env` y la secreta, en el del backend. Ninguna de las dos se sube al repositorio.

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

**212 tests en 40 archivos.** Cubren las utilidades (validaciones, formato, ciclo de estados, negritas), los mappers, el `httpClient`, los repositorios, el store de autenticación, los guards del router, los componentes y todas las vistas, incluido el panel de administración. Ninguno necesita el backend ni conexión a internet:

- En los tests de vistas, los repositorios se sustituyen por *mocks*.
- Los repositorios se prueban con el `httpClient` simulado, con una tabla de casos (`it.each`) que comprueba el verbo HTTP, la ruta y los datos de cada método.
- El `CaptchaWidget` se prueba con una API de Turnstile falsa (`window.turnstile`), sin cargar el script de Cloudflare.

[<img src="docs/screenshots/tests-frontend.png" width="500" alt="Resultado de los tests del frontend: 212 tests en verde">](docs/screenshots/tests-frontend.png)

### Cobertura

```bash
npx vitest run --coverage
```

La cobertura se mide con el proveedor **V8** de Vitest. Se calcula sobre todo el código de `src`, también sobre los archivos que no tienen tests, y el informe se abre en `coverage/index.html`.

| Medida | Cobertura |
|---|---|
| Sentencias | 96 % |
| Ramas | 92 % |
| Funciones | 92 % |
| Líneas | 97 % |

Todas las carpetas de `src` superan el 70 % en las cuatro medidas.

[<img src="docs/screenshots/coverage-frontend.png" width="500" alt="Informe de cobertura de Vitest: 96 % de sentencias y 92 % de ramas">](docs/screenshots/coverage-frontend.png)

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

**Importante:** los E2E deben ejecutarse con las **claves de prueba** del captcha, en el frontend y en el backend. Con claves reales, Cloudflare puede detectar el navegador automatizado y no dar el reto por superado, así que el registro no se completaría.

## Accesibilidad

- HTML semántico (`header`, `nav`, `main`, `footer`, `article`, `aside`, `time`, listas, `fieldset` y `legend`).
- Formularios con `label` asociada a cada campo y errores enlazados con `aria-describedby` y `aria-invalid`.
- Al enviar un formulario con errores, el foco va al primer campo con error.
- Diálogos con `role="dialog"` y `aria-modal`, foco inicial en la opción segura y cierre con Escape.
- Avisos y estados de carga anunciados con `aria-live`, `role="status"` y `role="alert"`.
- Botones repetidos con `aria-label` que incluye a qué elemento se refieren.
- `aria-current` para indicar dónde se está: la pestaña activa del panel y el artículo que se lee en Actualidad.
- Textos alternativos que describen lo que muestra cada foto; las imágenes decorativas llevan `alt=""`.

## Decisiones técnicas

- **Solicitud de pedido en lugar de compra online**, por el modelo real del negocio.
- **JavaScript en lugar de TypeScript**, para centrar el proyecto en Vue y en la arquitectura.
- **Un único cliente HTTP** con gestión uniforme de errores y del 401.
- **Nunca se envía un token caducado**: el backend rechaza con 401 cualquier token inválido, incluso en rutas públicas como el catálogo, así que el frontend comprueba la caducidad antes de enviarlo.
- **Pinia** para el estado global, con el token como única fuente de verdad.
- **Etiquetas de estado y de categoría en constantes**, y transformaciones (precios, fechas) fuera de las vistas.
- **Una sola vista de acceso** con pestañas, y **un solo formulario** para crear y editar productos y artículos.
- **El precio se escribe con coma o punto**, como es natural en español, y el mapper lo convierte a número.
- **Imagen por defecto** para los productos sin imagen o con un enlace roto.
- **Formulario de contacto en lugar de un correo visible**: evita que el correo se recoja para enviar spam y reúne los mensajes en el panel de administración.
- **Captcha (Cloudflare Turnstile) en el contacto y el registro**, los dos formularios públicos que crean datos. El botón de envío se activa solo al superar el reto, y el token se pide de nuevo tras cada envío porque solo sirve una vez.
- **Actualidad en formato periódico**: el artículo seleccionado va en la URL (`?articulo=id`), así funcionan los botones de atrás y adelante del navegador y se puede compartir el enlace a una noticia concreta.
- **E2E contra el backend real**, en lugar de simular la API.
- **Fotos reales del apiario** en lugar de imágenes generadas, para que la web sea fiel a la realidad del negocio. Las rutas de las imágenes se enlazan con `:src` desde constantes, para que Vite no las convierta en imports.
- **Artículos en borrador o publicados, sin borrado**: despublicar devuelve el artículo a borrador sin perder el texto. Es el mismo criterio que en las solicitudes de pedido: estados en lugar de borrar.
- **Negritas en los artículos sin `v-html`**: `parseBold` convierte `**texto**` en trozos que el template pinta con `<strong>`. El texto sigue escapado por Vue, así que no hay riesgo de XSS.
- **«Para el apicultor» como nombre de la categoría** de enjambres y reinas, en lugar de «productos», porque son animales vivos. Solo cambia la etiqueta: el valor interno de la API se mantiene.
- **`/recursos` redirige al primer apartado**, porque la sección no necesita página propia: se navega desde el menú.

## Próximos pasos

- **Categorías y página de detalle para los artículos de Actualidad**, con filtro por categoría.
- **Subida de imágenes** desde el panel, en lugar de indicar su ruta.
- **Aviso por correo al administrador** cuando llegue una solicitud o un mensaje de contacto.
- **Gestión de los mensajes de contacto**: marcarlos como leídos o archivarlos y, cuando lo pida la persona que escribió, eliminarlos.
- **Recorrido E2E del administrador.**
- **Despliegue** en un servidor con HTTPS y claves reales del captcha.

## Autora

**Gema Miguel** · [GitHub](https://github.com/gmp395)
