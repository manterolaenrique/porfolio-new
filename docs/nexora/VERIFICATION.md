# Verificación de Nexora en DEV

## Actualización 27/10/2026 — contacto por WhatsApp

El flujo activo se describe en [WHATSAPP.md](WHATSAPP.md). El número proporcionado por el usuario quedó guardado únicamente en `development`, en `contactInfo.whatsappNumber`; Nexora lo obtiene desde el contacto del portfolio mediante GROQ. No hay número duplicado en configuración Nexora, código del frontend ni variables de entorno.

- Tipos y build aprobados. El formulario mantiene una carga inicial de aproximadamente 164 kB: el icono se renderiza en servidor.
- 24 pruebas de lógica/datos aprobadas, incluidas validación de campos, email opcional, consentimiento, límite de descripción, codificación completa del mensaje y fuente compartida en Sanity.
- Nueve casos de navegador verificados. La primera pasada tuvo ocho aprobados y una respuesta 500 transitoria durante la compilación inicial de DEV. Se repitió escritorio y ambos formularios tras finalizar la compilación: tres aprobados. La última revisión visual repitió los dos formularios: dos aprobados.
- Comprobados: dos pasos, respuestas conservadas al volver, mensaje previo, consentimiento sin marcar, enlace al mismo destino que el contacto directo, y ninguna llamada del formulario a correo/Turnstile/Redis. Las aperturas de WhatsApp se interceptaron: no se enviaron mensajes.
- GET/POST del endpoint de correo devuelven 410 mientras permanezca diferido; Compose fuerza `NEXORA_ENABLE_EMAIL_QUOTES=false`.
- Extracción local de esquemas Sanity correcta. Regresión del portfolio, PDF del CV y autenticación oficial del Studio aprobadas.
- Sin deploy, push, merge, modificación de production ni cambios en los servicios de correo.

La verificación siguiente corresponde al flujo anterior del 26/10 y se conserva como historial.

Fecha: 26 de octubre de 2026. Rama: `feat/nexora-design-review`.

## Entorno disponible

- Nexora: http://localhost:3333/nexora
- Portfolio: http://localhost:3333/
- Studio: http://localhost:3333/admin
- Dataset: `development`, proyecto `qw8437rq`.
- Servicio Compose: `nexora-development-web-1`, estado saludable.
- Correo: modo de prueba, sin correos enviados.

Los puertos 3000 y 3001 pertenecían a servicios locales existentes. El origen 3003 no estaba autorizado por Sanity. Se utilizó 3333, ya autorizado, sin modificar CORS ni detener los otros servicios. El comando Windows detecta el puerto del contenedor existente o elige uno libre entre 3000, 3333 y 3001.

## Controles completados

| Control | Resultado |
| --- | --- |
| `npm run type-check` | Correcto |
| `npm run build`, con dataset development explícito | Correcto |
| `npm run test:nexora` | 19 pruebas aprobadas |
| Extracción local de esquemas Sanity | Correcta, `.cache/nexora/schema.json` |
| Imagen Docker, `npm ci`, Compose y healthcheck | Correctos |
| `npm run docker:dev`, reutilización del puerto y apertura automática | Correcto |
| Lectura pública de los tres proyectos relacionados y sus assets DEV | Correcta |
| Tarjetas 3D y movimiento del glow con puntero | Comprobados en navegador |
| Mockup con captura móvil real de DigitalFlow | Comprobado; sin etiqueta de vista adaptada |
| Movimiento reducido | Glow desactivado y contenido accesible |
| Diff sin errores de espacios | Correcto |

Las ocho pruebas de navegador cubren: seis rutas a 1440, 768 y 390 px; navegación móvil, filtros, mockup y 404; formulario de dos pasos con consentimiento y prueba honesta; HTML accesible sin JavaScript; recuperación de confirmación parcial con la misma referencia; y regresión de portfolio, PDF del CV y enlace oficial de autenticación Sanity.

La pasada sobre Docker tuvo cinco casos aprobados y tres pendientes por reinicio/compilación inicial y un selector de login que no coincidía con el texto real de Sanity. Se corrigió el selector para comprobar el enlace oficial de Google y se repitieron únicamente esos tres casos con el entorno estable: **3 aprobados, 0 fallos**. Los ocho casos quedaron verificados. Las seis rutas no presentaron errores de consola ni hidratación. Las capturas y trazas locales se generan en `test-results`; el informe más reciente está en `playwright-report`.

El build conserva advertencias de lint y metadatos del portfolio existente. No quedaron errores bloqueantes ni se actualizó Next.js, React o Sanity de versión mayor: Next 15.5.7, React 18.3.1 y Sanity 3.99.0.

## Datos, servicios externos y límites

Se exportaron 50 documentos desde production en lectura y se importaron a un nuevo dataset development. Los documentos comerciales se crearon allí con referencias a los proyectos técnicos. Las tres capturas móviles reales se recuperaron desde las demos públicas y se vincularon únicamente en development. No se reemplazaron los documentos originales del portfolio ni se modificó production.

Los tests del endpoint comprueban validaciones, honeypot, origen, límites, challenge inválido/vencido, doble envío concurrente, conflicto de referencia, fallos reales sin convertirlos en prueba y reintentos parciales sin repetir la notificación interna. Usan proveedores en memoria. La prueba visual de fallo parcial intercepta explícitamente Turnstile y el endpoint; no envía correos.

La entrega y recepción real de correos, Turnstile y Upstash requieren las credenciales DEV descritas en [DEV.md](DEV.md). No se provisionaron esos servicios ni se configuraron secretos de producción. Studio conserva su login oficial; la prueba llega al selector de proveedor y no inicia sesión por el usuario.

No se ejecutaron deploy, push, merge, publicación de Studio ni cambios de Vercel. No se incorporaron idiomas, testimonios generales ni la línea de tiempo de Fase 2. Los diseños y las 18 referencias del manifiesto Stitch se conservaron como referencia.
