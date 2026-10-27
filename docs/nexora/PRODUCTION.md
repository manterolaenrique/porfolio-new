# Publicación y administración en Sanity

La publicación de Nexora fue autorizada el 27/10/2026, después de la revisión en DEV. Esta etapa reemplaza el límite anterior de no publicar.

## Accesos

- Sitio: https://henrymanterola.dev.ar
- Nexora: https://henrymanterola.dev.ar/nexora
- Sanity producción: https://henrymanterola.dev.ar/admin
- Sanity DEV: http://localhost:3333/admin

Studio identifica el dataset en su título: **PRODUCCIÓN** o **DEV**. Conserva la autenticación oficial de Sanity.

Para cambiar textos, imágenes, servicios, proyectos o el número de WhatsApp de la web pública, entrar al Studio de producción, editar y pulsar **Publicar**. Los borradores no se muestran en el sitio. Los cambios de diseño, lógica o campos del Studio requieren actualizar el código.

El número se administra en **Portfolio → Información de Contacto → WhatsApp (portfolio y Nexora)**. Nexora usa ese dato compartido, no un número fijo en código o una variable de entorno.

## Separación de entornos

Producción lee `production`. Docker, Development y Preview usan `development`. Publicar en DEV no modifica producción ni copia automáticamente el contenido entre datasets.

La promoción inicial usa `scripts/promote-nexora-content.ts`: por defecto solo muestra un diagnóstico. Con `--apply`, crea los documentos Nexora que falten, resuelve las referencias hacia proyectos técnicos existentes, traslada los assets faltantes y añade únicamente WhatsApp y capturas móviles inexistentes. No reemplaza el dataset ni los documentos del portfolio. Se crea un respaldo antes de aplicar y las modificaciones a documentos existentes verifican su revisión.

## Publicar contenido sin redeploy

Un webhook de Sanity, limitado a documentos publicados de `production`, llama a `/api/revalidate`. La petición se autentica mediante una cabecera privada; su valor no se incluye en URL, Git o archivos desplegados. El handler invalida el layout raíz, detalles de proyectos y caché Nexora. La siguiente visita vuelve a leer el contenido publicado, sin un nuevo deploy.

Se mantiene compatible el mecanismo anterior con `REVALIDATE_SECRET`. El nuevo secreto es independiente. La consulta del CMS usa la API de origen para evitar conservar una respuesta vieja de la CDN tras publicar.

El correo continúa deshabilitado; las consultas se preparan en el navegador y el visitante completa el envío en WhatsApp.
