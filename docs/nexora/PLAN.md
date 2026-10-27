# Nexora: plan definitivo de diseno e implementacion

Estado: aprobado para ejecutar la Etapa 1A. La implementacion 1B requiere la
aprobacion expresa de la entrega visual. Este documento sustituye planes previos.

## Alcance

Repositorio: porfolio-new. Mantener Next.js App Router, TypeScript, Tailwind,
Sanity compartido y la identidad actual del portfolio. Trabajar en rama separada.
No hacer despliegues, push a main, merges ni cambios de produccion.

| Pagina | Ruta |
| --- | --- |
| Inicio | /nexora |
| Servicios | /nexora/servicios |
| Proyectos | /nexora/proyectos |
| Detalle | /nexora/proyectos/[slug] |
| Sobre Nexora | /nexora/nosotros |
| Contacto y presupuesto | /nexora/contacto |

Layout, navegacion, footer, metadatos y estilos propios de Nexora. Usar Server
Components salvo interacciones. Reutilizar utilidades neutrales y assets reales.
El unico cambio funcional del portfolio sera el acceso comercial Nexora en la
navegacion desktop/mobile. Conservar GitHub, proyectos, CV y contacto. La linea
de tiempo laboral y de proyectos personales corresponde a la Fase 2.

## Etapa 1A: diseno y revision

- Proyecto Stitch existente: 2133477259622614950.
- Sistema existente: assets/146e1f30406c453facfc10e43e82a4d4 (Dark Tech Studio).
- Reutilizar Inicio, Servicios y Proyectos; completar Detalle, Nosotros, Contacto.
- Consultar inventario y manifiesto antes de generar. No crear proyectos ni
  pantallas duplicadas. Revisar las pantallas existentes mediante edicion.
- Seis paginas, cada una con variantes desktop 1440, tablet 768 y mobile 390.
- Conservar Sora, Geist y los acentos violeta/turquesa. Sin datos comerciales
  inventados, testimonios generales ni enlaces ficticios presentados como reales.
- Registrar IDs, rutas, dispositivos, revisiones, aprobacion y recursos exportados
  en manifest.json. Recuperar HTML y PNG por MCP; exportacion manual solo de respaldo.
- Presentar los disenos y detenerse para revision. No implementar pantallas,
  esquemas, dependencias ni Docker antes de aprobar esta entrega visual.

## Las cinco animaciones obligatorias

1. Scroll Reveal: entrada una vez al aparecer en pantalla, sin impedir lectura.
2. Hero animado: entrada escalonada de marca, titulo, texto, CTA y recurso visual.
3. Tarjetas 3D: inclinacion por puntero, perspectiva y retorno suave a neutral.
4. Mockups desktop/mobile: selector accesible entre capturas reales y transicion.
5. Glow con cursor: iluminacion localizada en el recurso o tarjeta bajo el puntero.

Usar Framer Motion y transformaciones CSS. Menu, hover basico y parallax no
sustituyen estos efectos. Respetar teclado, touch y prefers-reduced-motion.
HTML inicial determinista; sin aleatoriedad ni contenido esencial oculto por JS.

## Sanity y proyectos comerciales (Etapa 1B)

Studio unico /admin con grupos Portfolio y Nexora. Nuevos tipos nexoraSettings,
nexoraService y nexoraProject. DEV usa exclusivamente development; copiar de
production hacia development sin modificar el origen ni reemplazar documentos
del portfolio mediante seeds. Produccion no se modifica durante esta entrega.

nexoraProject puede referenciar fuertemente un project tecnico por technicalProject.
En ese caso GROQ resuelve imagenes, galeria, tecnologias, demo y repositorio desde
la referencia sin copiarlos. Sin referencia admite productos independientes con
esos datos propios. Campos comerciales independientes: titulo, slug, categoria,
estado, resumen, problema, solucion, funcionalidades, resultados verificables y orden.
Los mockups identifican explicitamente capturas desktop/mobile y reutilizan assets.

Recomendacion opcional por proyecto: texto, autor y atribucion. Mostrarla solo en
el detalle correspondiente cuando tenga contenido valido. Sin coleccion global,
testimonios en Inicio/Nosotros ni agregaciones. Mantener consultas _type == project.
Agregar modelos TS, consultas independientes, estados vacios, SEO y 404 reales.

## Presupuesto de dos pasos (Etapa 1B)

Paso 1: tipo obligatorio (web, SaaS, sistema a medida,
automatizacion/integracion, otro); presupuesto obligatorio (unknown, defined,
discuss); descripcion opcional, maximo 2000 caracteres. defined no exige importe.

Paso 2: nombre y email validos obligatorios; empresa y plazo de inicio opcionales;
consentimiento obligatorio sin marcar. Explicar tratamiento para responder la
consulta y confirmar por email, sin suscripcion comercial. Conservar valores al
avanzar/volver; validar por paso y enfocar primer error.

POST /api/nexora/presupuesto valida todo con Zod en servidor. Resend envia primero
notificacion interna con replyTo del cliente y luego confirmacion fija al cliente,
sin reflejar texto arbitrario. Remitente y destinatario interno solo en servidor.

Protecciones: Turnstile validado en servidor, honeypot, origen, rate limiting
Upstash Redis (5/IP/15 minutos, 3 solicitudes nuevas/email/hora), identificadores
HMAC sin IP/email en claro. Redis conserva temporalmente estado e idempotencia;
no guardar presupuestos en Sanity. Clave distinta por correo, misma solicitud al
reintentar y envio exclusivo del correo pendiente. Fallo parcial se comunica sin
reenviar la notificacion ya aceptada ni fingir que la solicitud se perdio.

DEV usa modo prueba explicito: validar pasos y revisar dos plantillas, mostrando
"Modo de prueba: no se enviaron correos". Diferenciar test, completo y parcial.
Fallo de envio real nunca se transforma silenciosamente en prueba. Envio real
deshabilitado hasta configurar Resend, remitente verificado, Turnstile y Redis DEV.

## Docker y Windows 11 (Etapa 1B)

Compose con un servicio Next.js Node 24 y Studio integrado. Lockfile versionado,
npm ci, hot reload, volumenes separados node_modules/.next, secretos fuera de
Git e imagenes. Dataset development explicito y guardia contra production.

npm run docker:dev usa PowerShell: verificar Docker Desktop, levantar Compose,
esperar disponibilidad y abrir http://localhost:3000/nexora y /admin. Mantener
autenticacion oficial Sanity, sin auto-login. Documentar Windows 11, inicio,
parada, logs, puertos y recuperacion. Correo y solicitudes en prueba por defecto.

## Secuencia y aceptacion

1. Completar y revisar Etapa 1A antes de cualquier implementacion funcional.
2. Tras aprobar disenos: rama, development, esquemas y Docker.
3. Seis rutas, reutilizacion de datos, cinco animaciones y formulario protegido.
4. Agregar acceso Nexora al portfolio y verificar todo en DEV.

Aceptar con seis paginas/tres dispositivos revisados y manifestados; /nosotros
consistente; sin duplicados; datos relacionados sin duplicacion; productos
independientes; recomendaciones solo por detalle; teclado/touch/reduced motion;
limite de 2000 y consentimiento; Turnstile/honeypot/rate limit/concurrencia/doble
clic/fallo parcial/reintento; prueba honesta; Docker development y login oficial;
type-check, build, pruebas de API y Playwright; sin hidratacion ni errores de
consola y sin regresiones del portfolio. Ningun despliegue ni cambio de produccion.

Dependencias posteriores: Docker Desktop activo, permisos development, Resend,
Turnstile y Upstash DEV. No provisionarlos durante la Etapa 1A.
