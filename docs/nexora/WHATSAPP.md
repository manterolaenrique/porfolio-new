# Contacto por WhatsApp — 27/10/2026

Esta decisión reemplaza temporalmente el envío por correo del plan original. No requiere configurar Resend, Turnstile, Upstash ni WhatsApp Business API.

## Flujo activo

1. Elegir tipo de proyecto y presupuesto. La descripción es opcional y admite hasta 2.000 caracteres.
2. Completar nombre; empresa, email y plazo son opcionales. Revisar la vista previa del mensaje y aceptar compartir los datos por WhatsApp.
3. Pulsar **Enviar por WhatsApp**. Se abre un enlace oficial `https://wa.me/<numero>?text=<mensaje codificado>` en otra pestaña. La persona revisa o edita el texto y envía el mensaje desde WhatsApp. El sitio no afirma que la consulta fue recibida ni envía mensajes automáticamente.

La idea y los datos se conservan al volver entre pasos. El mensaje incluye las respuestas y omite las opciones vacías. No se guardan consultas en Sanity, Redis, localStorage ni sessionStorage. El enlace de respaldo permite abrir el mensaje si el navegador bloqueó la nueva pestaña.

Los CTAs comerciales siguen llevando al formulario para preparar la idea; la sección de contacto también permite iniciar una conversación directa con un saludo breve cuando hay número configurado.

## Número compartido en Sanity

En `http://localhost:3333/admin`, abrir **Portfolio → Información de Contacto → WhatsApp (portfolio y Nexora)**. El campo es `contactInfo.whatsappNumber`, en el documento singleton `contactInfo` del dataset `development`.

Usar el número internacional completo, con código de país. Se admiten separadores de presentación y `+`; al construir el enlace se conservan solo los dígitos. No hay un número predeterminado ni uno duplicado dentro de `nexoraSettings`. No se usa una variable de entorno para este dato.

La consulta GROQ de Nexora obtiene el número directamente de ese documento. Si falta o no tiene formato válido, la preparación del mensaje sigue disponible pero el botón final queda deshabilitado con una explicación.

Durante esta actualización se revisaron documentos publicados y borradores del proyecto `qw8437rq`, en development y production, en lectura. El usuario aclaró que el número figuraba en su CV y proporcionó el contacto. Se configuró ese dato únicamente en `contactInfo.whatsappNumber` de development. No se modificaron documentos de production ni se guardó el número en variables de entorno o en el código del frontend.

## Correo en pausa

El backend de correo y las pruebas de idempotencia se conservan para más adelante. `NEXORA_ENABLE_EMAIL_QUOTES=false` mantiene HTTP 410 en GET/POST del endpoint antiguo. Compose lo fuerza a `false`. El formulario activo no consulta ese endpoint ni carga Turnstile; no necesita credenciales de correo o Redis.

Referencia del formato del enlace: [Centro de ayuda oficial de WhatsApp](https://faq.whatsapp.com/5913398998672934).
