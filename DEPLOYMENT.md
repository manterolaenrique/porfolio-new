# Guía de Deployment en Vercel

Esta guía te ayudará a desplegar tu portfolio en Vercel paso a paso.

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [GitHub](https://github.com)
- Proyecto Sanity configurado
- Código subido a GitHub

## 🚀 Pasos de Deployment

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/portfolio.git
git push -u origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona "Import Git Repository"
3. Autoriza acceso a GitHub si es necesario
4. Selecciona tu repositorio

### 3. Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Next.js.

**Configuración recomendada:**
- Framework Preset: **Next.js**
- Root Directory: `./` (raíz)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4. Configurar Variables de Entorno

En la sección "Environment Variables", añade:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=tu-read-token
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

**⚠️ Importante:**
- Las variables `NEXT_PUBLIC_*` son públicas
- `SANITY_READ_TOKEN` es privado (solo servidor)
- Usa el mismo dataset que configuraste en Sanity

### 5. Deploy

Click en **"Deploy"** y espera a que termine el build.

## 🔄 Deploys Automáticos

Vercel configurará automáticamente:
- **Production**: Deploys de la rama `main`
- **Preview**: Deploys de Pull Requests

Cada push a `main` desplegará automáticamente.

## 🌐 Dominio Personalizado

### Configurar tu Dominio

1. Ve a **Settings** → **Domains**
2. Click en **"Add Domain"**
3. Ingresa tu dominio (ej: `enriquemanterola.com`)
4. Sigue las instrucciones para configurar DNS

### Configuración DNS

Si usas tu propio dominio, añade estos registros:

**Para dominio raíz (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Vercel te dará las instrucciones exactas para tu proveedor DNS.

## 🔧 Configuración Avanzada

### Custom Build Settings

Crea `vercel.json` en la raíz:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "crons": [
    {
      "path": "/api/revalidate",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Headers de Seguridad

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Redirects

```json
{
  "redirects": [
    {
      "source": "/github",
      "destination": "https://github.com/tu-usuario",
      "permanent": false
    }
  ]
}
```

## 📊 Analytics

### Vercel Analytics

1. Ve a tu proyecto en Vercel
2. Click en **"Analytics"** tab
3. Enable **Vercel Analytics**
4. Añade el script en `layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## 🔄 Revalidación y Webhooks

### Configurar Webhook de Sanity

Para revalidar cuando cambies contenido:

1. En Sanity Studio, ve a **API** → **Webhooks**
2. Click **"Create webhook"**
3. Configura:
   - Name: `Revalidate Vercel`
   - URL: `https://tu-dominio.vercel.app/api/revalidate`
   - Dataset: `production`
   - Trigger on: `Create`, `Update`, `Delete`

4. Crea la ruta API en `src/app/api/revalidate/route.ts`:

```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    revalidatePath('/')
    return NextResponse.json({ revalidated: true })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
```

5. Añade `REVALIDATE_SECRET` a variables de entorno

## 🐛 Troubleshooting

### Build Falla

**Error: "Module not found"**
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de usar paths absolutos correctos

**Error: "Environment variable not found"**
- Verifica que todas las variables estén configuradas en Vercel
- Variables `NEXT_PUBLIC_*` deben estar disponibles en build time

### Imágenes No Cargan

- Verifica `remotePatterns` en `next.config.mjs`
- Asegúrate de que Sanity CDN esté accesible
- Revisa las URLs generadas por `urlFor()`

### Funciones Timeout

- Vercel Pro permite hasta 60s
- Hobby (free) permite 10s
- Optimiza queries de Sanity
- Implementa caching

## 📈 Monitoreo

### Logs

Accede a logs en tiempo real:
```bash
vercel logs https://tu-dominio.vercel.app
```

### Performance

Monitorea en el dashboard:
- Build times
- Bundle size
- Response times
- Error rates

## 🎉 ¡Listo!

Tu portfolio ahora está desplegado en:
- Production: `https://tu-dominio.vercel.app`
- Sanity Studio: `https://tu-dominio.vercel.app/admin`

## �️ Configuración local de Sanity y seed

Sigue estos pasos para conectar tu proyecto local a Sanity y poblar datos iniciales:

1. Crea un fichero `.env.local` en la raíz (no lo subas al repo). Puedes basarte en `.env.local.example`.

Ejemplo mínimo de `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_WRITE_TOKEN=tu-write-token
SANITY_READ_TOKEN=tu-read-token # opcional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Crea tokens desde el panel de Sanity (Settings → API):
  - Un token con permisos `write` para ejecutar `scripts/seedSanity.js`.
  - (Opcional) un token `read` para desarrollo.

3. Ejecuta el seed (sube datos de ejemplo y assets placeholder):

```powershell
node scripts/seedSanity.js
```

El script subirá un placeholder de imagen y creará documentos `siteSettings`, `hero`, `about`, `skills`, `skillGroup`, `socialLink` y un `project` de ejemplo.

4. Inicia el dev server de Next:

```powershell
npm run dev
```

5. Abre el Studio (si está embebido en la app):

```
http://localhost:3000/admin
```

Si el seed falla por permisos, revisa que `SANITY_WRITE_TOKEN` tenga permisos de escritura y que `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` estén correctos.

## �📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Sanity Webhooks](https://www.sanity.io/docs/webhooks)

## Sanity Revalidation Workflow (on-demand)

Este repo usa `POST /api/revalidate?secret=...` para invalidar cache cuando cambia contenido en Sanity.

### Variables requeridas en Vercel (Production)

```env
REVALIDATE_SECRET=un-valor-largo-y-aleatorio
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_READ_TOKEN=<token-read>
SANITY_WRITE_TOKEN=<token-write-opcional-para-seed-y-backup>
```

### Crear webhook en Sanity

1. Sanity Manage -> API -> Webhooks -> Create webhook
2. URL: `https://<tu-dominio>/api/revalidate?secret=<REVALIDATE_SECRET>`
3. Dataset: `production`
4. Triggers: `Create`, `Update`, `Delete`

### Prueba manual de revalidacion

```bash
curl -X POST "https://<tu-dominio>/api/revalidate?secret=<REVALIDATE_SECRET>" -H "content-type: application/json" -d "{\"paths\":[\"/\",\"/projects\"]}"
```

Respuesta esperada:

```json
{"revalidated":true,"paths":["/","/projects"]}
```

### Flujo para editores de contenido

1. Editar contenido en `/admin`.
2. Publicar cambios.
3. Sanity dispara el webhook.
4. Vercel registra el `POST /api/revalidate`.
5. La web publica refleja cambios en la siguiente visita.

### Backup y rollback de dataset

Export (backup):

```bash
npm run backup:prod
```

Import (rollback):

```bash
npx sanity dataset import ./backups/<archivo>.tar.gz production --replace --project-id <project-id> --token <sanity-manage-o-write-token>
```
