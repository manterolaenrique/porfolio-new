## 🚀 DEPLOY A VERCEL

Aquí está el paso a paso para desplegar tu portafolio en Vercel.

### Opción 1: Desde Vercel Dashboard (RECOMENDADO)

#### Paso 1: Conectar GitHub

1. Ve a https://vercel.com/login
2. Haz login con GitHub (o crea cuenta)
3. Click en "New Project"
4. Click en "Import Git Repository"
5. Busca tu repositorio `portfolio`
6. Click en "Import"

#### Paso 2: Configurar Variables de Entorno

En la pantalla de configuración, agrega estas variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=tu_read_token
```

**Cómo obtener estos valores:**
- Ve a Sanity Studio → Configuración → API
- Project ID: es visible en la página
- Dataset: generalmente `production`
- SANITY_READ_TOKEN: crea un nuevo token en la sección "Tokens"

#### Paso 3: Desplegar

1. Click en "Deploy"
2. Espera a que termine (5-10 minutos)
3. Una vez finalizado, verás tu dominio de Vercel (ej: `portfolio-chi.vercel.app`)

#### Paso 4: Configurar Dominio Personalizado (Opcional)

1. En Vercel → Proyecto → Settings → Domains
2. Click en "Add Domain"
3. Escribe tu dominio (ej: `enriquemanterola.com`)
4. Sigue las instrucciones para configurar DNS
5. Espera a que se propague (puede tomar 24-48 horas)

---

### Opción 2: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar (sigue las instrucciones interactivas)
vercel

# Desplegar a producción
vercel --prod
```

---

### Opción 3: GitHub Actions (Automático)

Ya está configurado automáticamente. Cada vez que hagas `git push`:

1. GitHub dispara una acción
2. Se hace build en Vercel
3. Se deploya automáticamente si todo es correcto

---

## ✅ Verificar Deployment

Después de desplegar, verifica:

```bash
# Test 1: Accede a la URL
# Deberías ver tu portafolio

# Test 2: Comprueba que Sanity carga
# Las secciones deben mostrar contenido

# Test 3: Verifica imagen de CV
# Debe mostrar la imagen subida en Sanity

# Test 4: Prueba responsive
# Abre en móvil, tablet y desktop
```

---

## 🔄 Actualizaciones Futuras

Cada vez que actualices contenido en Sanity o código en GitHub:

1. **Cambios en Sanity**: Se ven automáticamente (ISR revalidates cada hora)
2. **Cambios en código**: 
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin main
   ```
   Vercel automáticamente redeploya

---

## 🆘 Troubleshooting

### El sitio no carga
- Verifica que las variables de entorno estén correctas
- Revisa los logs en Vercel Dashboard
- Intenta rebuildear: Settings → Deployments → Redeploy

### La imagen del CV no se ve
- Comprueba que esté subida en Sanity
- Verifica el SANITY_READ_TOKEN
- Revisa Network tab en DevTools

### Dominio personalizado no funciona
- Espera a que se propague el DNS (puede tardar 48h)
- Verifica que los registros DNS estén correctos
- Reinicia el proceso de agregar dominio

---

## 📊 Monitoreo

En Vercel Dashboard puedes:
- Ver analytics de tráfico
- Monitorear tiempos de respuesta
- Ver historial de deployments
- Configurar alertas

---

**¡Listo! Tu portafolio está en línea. 🎉**
