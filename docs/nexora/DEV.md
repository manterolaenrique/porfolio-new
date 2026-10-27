# Nexora en DEV — Windows 11

**Actualización 27/10/2026:** el canal activo de consultas es WhatsApp. Se mantienen los dos pasos, la vista previa del mensaje y el email pasa a ser opcional. El teléfono se administra únicamente en **Portfolio → Información de Contacto → WhatsApp (portfolio y Nexora)**, documento `contactInfo`; Nexora lo lee mediante GROQ, sin duplicarlo en su configuración ni usar variables de entorno para el número. Si falta, se puede preparar la consulta pero no abrir un destino inventado. Resend, Turnstile y Upstash quedan diferidos. Ver [WHATSAPP.md](WHATSAPP.md).

El trabajo se preparó en `feat/nexora-design-review`. La publicación aprobada y los accesos a Sanity se describen en [PRODUCTION.md](PRODUCTION.md).
El portfolio conserva sus secciones y agrega el acceso Nexora en ambos menús.
La línea de tiempo profesional queda fuera de esta etapa.

## Inicio con Node

Requisitos: Node 24, npm y acceso oficial de Sanity CLI al proyecto `qw8437rq`.

1. Ejecutar `npm ci`.
2. Copiar `.env.docker.example` como `.env.development.local`, conservando `development` y correo `test`.
3. Si el dataset todavía no existe, ejecutar `npx sanity login` y `npm run sanity:prepare-dev`.
4. Ejecutar `npm run dev`. Para otro puerto: `npm run dev -- --port 3002`.

El lanzador rechaza otro dataset. Si GitHub CLI tiene sesión, inyecta su token solamente en el proceso hijo; no lo escribe en archivos. Si se usa Docker, proporcionar `GITHUB_TOKEN` únicamente en el entorno local ignorado es opcional para las estadísticas existentes.

La preparación consulta los datasets y, solo cuando falta `development`, exporta `production` en lectura e importa una copia en `development`. No usa la función paga de copia de datasets. La copia privada de respaldo queda en `.cache/nexora`, fuera de Git y de la imagen Docker. Si `development` existe, no importa ni reemplaza documentos del portfolio. Los seeds comerciales usan `createIfNotExists` y referencias fuertes a los proyectos técnicos.

## Inicio con Docker Desktop

Requisitos: Windows 11, Docker Desktop abierto con motor Linux y WSL 2 habilitado.
Desde PowerShell, ejecutar:

```powershell
npm run docker:dev
```

El comando crea `.env.docker.local` desde el ejemplo si falta, valida el dataset, construye la imagen, espera el estado saludable y abre el primer puerto libre entre 3000, 3333 y 3001, ya autorizados por este proyecto Sanity. Con 3000 libre abre:

- Nexora: `http://localhost:3000/nexora`
- Sanity Studio: `http://localhost:3000/admin`

Studio utiliza la autenticación oficial de Sanity; abrirlo no inicia sesión. La configuración de Compose fuerza `development`, incluso si un archivo local antiguo dice `production`. El servicio de correo de Compose queda forzado a `test`.

Para un puerto ocupado:

```powershell
$env:NEXORA_PORT='3333'
npm run docker:dev
```

Sitio y Studio se abren usando ese puerto. Next escucha en el puerto interno 3000. Las validaciones de origen usan el puerto del navegador. Otro puerto requiere que su origen figure en Sanity CORS; el lanzador no modifica esa configuración compartida. En esta entrega se usa 3333 para conservar el servicio existente en 3000.

Comandos útiles:

```powershell
docker compose logs --follow web
docker compose ps
npm run docker:stop
```

Si cambia el lockfile y el volumen conserva dependencias viejas, parar el servicio y renovar solamente su volumen `nexora-development_dependencies`. No borrar volúmenes de otros proyectos. Reconstruir y volver a iniciar. El contenido del CMS permanece en Sanity.

## Contenido y modelos

Studio separa Portfolio y Nexora. Nexora tiene `nexoraSettings`, `nexoraService` y `nexoraProject`.

- Con `technicalProject`, imágenes, galería, tecnologías, demo y código se resuelven por GROQ desde el proyecto técnico. Los campos comerciales son independientes.
- Sin referencia, el bloque `standalone` requiere imagen y tecnologías propias. Puede reutilizar assets existentes.
- `devicePreviews.mobile` del proyecto técnico permite compartir su captura móvil real. El mockup indica “Vista adaptada” si no hay captura móvil, sin afirmar que la captura desktop es mobile.
- La recomendación opcional solo se presenta dentro del detalle correspondiente. No hay testimonios generales.
- Los proyectos sin slug o imagen se omiten; un slug inexistente devuelve 404. Hay estados vacíos y filtros.
- En DEV la lectura no usa caché persistente para que los cambios del Studio sean visibles. Fuera de DEV revalida cada hora; el webhook existente también invalida el layout Nexora, sin configurar webhooks externos automáticamente.

`node scripts/capture-nexora-mobile.cjs` recupera capturas reales de las tres demos públicas usando Playwright. Su manifiesto queda en `.cache/nexora/mobile`. `npm run sanity:prepare-dev` sube esas imágenes solo a `development` y las vincula cuando falta una captura, sin reemplazar una existente. Las capturas desktop siguen siendo los assets originales del CMS.

## Correo diferido (referencia para una etapa futura)

El formulario activo prepara un enlace WhatsApp en el navegador y no llama al endpoint de correo. Este endpoint devuelve HTTP 410 mientras `NEXORA_ENABLE_EMAIL_QUOTES` no sea `true`; Compose fuerza esta opción a `false`. El código de correo y sus pruebas se conservan para una etapa futura. La siguiente configuración no es necesaria para usar WhatsApp.

En una etapa futura, para habilitar el endpoint de correo fuera del Compose conservador, configurar credenciales **DEV** en `.env.development.local`, `NEXORA_ENABLE_EMAIL_QUOTES=true` y `NEXORA_MAIL_MODE=live`; también habrá que volver a conectar la interfaz al correo:

- `RESEND_API_KEY`, `NEXORA_QUOTE_FROM` (remitente verificado), `NEXORA_QUOTE_TO`.
- `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (hostname local autorizado).
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` de una instancia de desarrollo independiente.
- `NEXORA_HMAC_SECRET` aleatorio de al menos 32 caracteres, solo servidor.

No incluir secretos con prefijo `NEXT_PUBLIC_`. No subir archivos `.env` a Git ni copiar credenciales de producción.

Si falta correo, el modo es prueba explícita. Si se pide envío real con correo configurado pero faltan protecciones, queda no disponible. Una falla durante un envío real nunca se transforma silenciosamente en prueba.

La notificación interna se acepta primero; luego se solicita la confirmación al cliente. Redis coordina bloqueo, huella de contenido y los IDs de ambos envíos durante la ventana de reintento. Resend recibe claves distintas `nexora/<requestId>/internal` y `nexora/<requestId>/confirmation`. Una falla parcial conserva la referencia y solo reintenta la confirmación pendiente. Los límites son 5 solicitudes/IP/15 minutos y 3 solicitudes nuevas/email/hora. Las claves de límites usan HMAC. No se guardan presupuestos en Sanity ni IP/email en claro en Redis.

## Verificación

```powershell
npm run type-check
npm run test:nexora
$env:NEXT_PUBLIC_SANITY_DATASET='development'
npm run build
$env:PLAYWRIGHT_BROWSERS_PATH=Join-Path $PWD '.cache/ms-playwright'
npx playwright install chromium
$env:E2E_BASE_URL='http://localhost:3333'
npm run test:e2e
```

El build no despliega. Ejecutarlo con el dataset `development` explícito, porque Next carga `.env.local` al compilar para producción. No ejecutar build y dev simultáneamente sobre la misma carpeta `.next`.

Las pruebas del endpoint usan proveedores en memoria: comprueban validación, origen, honeypot, límites, concurrencia, claves/reintentos y fallos parciales sin enviar correos reales. Las pruebas GROQ evalúan vinculación, cambio del proyecto técnico, producto independiente y recomendaciones. Playwright recorre seis rutas a 1440/768/390 px, filtros, navegación móvil, mockups, formulario, contenido sin JavaScript y regresión del CV/Studio. Las credenciales y entregabilidad reales de los servicios externos requieren configuración DEV; no se provisionaron servicios de correo ni protecciones durante esta entrega.
