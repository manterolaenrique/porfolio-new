# Nexora: entrega visual, Etapa 1A

La implementación DEV continúa a partir de esta entrega visual. Ver [DEV.md](DEV.md) para inicio con Node/Docker, modelos, formulario y verificaciones. Los archivos Stitch y su manifiesto se conservan como referencia; no se generaron nuevos diseños durante la implementación.

Abrir `review.html` para revisar seis paginas en marcos de 1440, 768 y 390 px.
El proyecto Stitch sigue siendo https://stitch.withgoogle.com/projects/2133477259622614950.
No se creo otro proyecto. Las revisiones de Stitch conservan sus IDs anteriores
como historial; `manifest.json` identifica una referencia canonica por pagina y dispositivo.

## Que contiene esta entrega

- `PLAN.md`: referencia definitiva aprobada para el alcance y la secuencia.
- `ANIMATIONS.md`: las cinco animaciones obligatorias y sus fallbacks.
- `manifest.json`: 18 referencias, recursos de origen, revisiones y aprobacion pendiente.
- `stitch/<pagina>/<dispositivo>/source.html`: descarga original del MCP, sin modificar.
- `stitch/<pagina>/<dispositivo>/design.html`: maqueta HTML para revisar.
- `stitch/<pagina>/<dispositivo>/review.css`: estilos compilados con las dependencias existentes.
- `stitch/<pagina>/<dispositivo>/screen.png`: captura original de Stitch a resolucion completa.
- `assets/`: tres capturas reales compartidas, recuperadas del CMS en solo lectura.
- `asset-reconciliation.json`: reemplazos de recursos registrados por maqueta.
- `verification.json`: resultados de controles estaticos, sin atribuir pruebas de navegador.

Los recursos de origen y los IDs se recuperaron mediante MCP. `download_assets`
reporto exito pero no creo archivos en esta maquina; algunas respuestas binarias
de `download_file` tampoco finalizaron. Se guardaron las capturas desde las URLs
publicas de imagen devueltas por el propio MCP, a resolucion original (`=s0`),
sin credenciales ni exportacion manual. El HTML se recupero por `download_file`.

## Diferencias que hay que conocer al revisar

Stitch genero imagenes de muestra en algunas capturas pese a recibir las URLs
reales. Por eso `review.html` muestra el HTML con capturas reales del portfolio,
no usa el PNG original como prueba de los productos. Los PNG se conservan como
referencias de composicion, y NO como capturas autenticas de tus aplicaciones.
Tambien se normalizaron valores del presupuesto y se retiraron afirmaciones de
latencia/Turnstile que no estaban verificadas. Las fuentes y algunos logotipos
originales pueden requerir Internet; el CSS ya no depende del script CDN Tailwind.

Algunas capturas de Stitch se generaron con anchos distintos al solicitado,
incluyendo variantes llamadas Tablet capturadas a ancho mobile. El visor fija
el marco HTML al ancho objetivo; `verification.json` registra esas diferencias.
No se afirma que la maquetacion a esos anchos haya pasado una prueba de navegador.

El navegador integrado rechazo la apertura de archivos locales por su politica
de URL. No se cambio de navegador, no se sirvieron esos archivos por HTTP y no
se uso CDP para eludir el bloqueo. La entrega se verifico con analisis estatico,
recursos locales y metadatos; la revision visual y de interaccion queda pendiente.

## Revisar antes de aprobar Etapa 1B

1. Elegir las seis paginas y los tres dispositivos en el visor.
2. Revisar jerarquia, legibilidad, contenido y los mockups con recursos reales.
3. En Contacto probar los dos pasos, volver, consentimiento y estados de prueba.
4. Revisar las cinco animaciones en su especificacion: son requisitos de la
   implementacion posterior, no animaciones React ya implementadas.
5. Registrar correcciones o aprobar expresamente los disenos.

Los controles de estados de Contacto son herramientas de revision de la maqueta.
No envian mensajes, no verifican un CAPTCHA real y no representan un backend.
El formulario real de dos correos, Zod, Turnstile, rate limiting e idempotencia
se implementara en Etapa 1B, junto con Next.js, Sanity development y Docker.

## Estado del repositorio

Rama: `feat/nexora-design-review`. Solo se agregan documentos y recursos bajo
`docs/nexora`. Sin cambios en `src`, esquemas, dependencias, Docker, variables,
contenido Sanity, despliegues o produccion. Sin push ni merge.

Para repetir las comprobaciones estaticas: `node docs/nexora/verify-review.cjs`.
Los auxiliares usan dependencias ya instaladas; no se agregaron paquetes.
