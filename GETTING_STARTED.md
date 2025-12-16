# 🎯 INSTRUCCIONES DE INICIO RÁPIDO

## 📦 Instalación

1. **Instalar dependencias**
```powershell
npm install
```

2. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=tu-read-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. **Inicializar Sanity**

```powershell
npm install -g @sanity/cli
sanity init
```

Sigue las instrucciones:
- Create new project
- Use default dataset configuration: Yes
- Project output path: . (punto)
- Select project template: Clean project with no predefined schemas

4. **Copiar el Project ID**

Después de `sanity init`, copia el `projectId` que aparece y actualízalo en `.env.local`

5. **Iniciar el proyecto**

```powershell
npm run dev
```

Abre:
- **Portfolio**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/admin

## ✅ Siguientes Pasos

### 1. Configurar Sanity Studio

Ve a http://localhost:3000/admin y:
- Inicia sesión con tu cuenta Sanity
- Verás el Studio con todos los schemas ya configurados

### 2. Agregar Contenido

Sigue la guía en `SAMPLE_DATA.md` para poblar el CMS:

1. **Configuración del Sitio** (siteSettings)
2. **Redes Sociales** (4 links)
3. **Hero** (tu información)
4. **Skills** (15+ habilidades)
5. **Grupos de Skills** (3 grupos)
6. **Sobre Mí** (tu bio)
7. **Proyectos** (3+ proyectos)

### 3. Ver el Resultado

Una vez agregado el contenido:
- Recarga http://localhost:3000
- Verás tu portfolio completo
- Prueba las animaciones y navegación

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.ts`:

```typescript
colors: {
  brand: {
    primary: '#TU_COLOR',
    secondary: '#TU_COLOR',
    // ...
  },
}
```

### Cambiar Fuentes

Edita `src/app/layout.tsx`:

```typescript
import { TuFuente } from 'next/font/google'
```

### Modificar Secciones

Los componentes están en:
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/ProjectsSection.tsx`

## 🚀 Deployment

Cuando estés listo para desplegar:

1. Sube tu código a GitHub
2. Ve a https://vercel.com/new
3. Importa tu repositorio
4. Configura las variables de entorno
5. Deploy

Guía detallada en `DEPLOYMENT.md`

## 📚 Documentación

- **README.md** - Overview y setup completo
- **ARCHITECTURE.md** - Decisiones técnicas
- **DEPLOYMENT.md** - Guía de despliegue en Vercel
- **SAMPLE_DATA.md** - Datos de ejemplo
- **CONTRIBUTING.md** - Guía de contribución
- **CHANGELOG.md** - Historial de cambios

## ❓ Problemas Comunes

### "Cannot find module"
```powershell
rm -rf node_modules
rm package-lock.json
npm install
```

### Sanity no se conecta
- Verifica que `NEXT_PUBLIC_SANITY_PROJECT_ID` sea correcto
- Asegúrate de estar logueado en Sanity CLI: `sanity login`

### Imágenes no cargan
- Verifica `next.config.mjs` tenga configurado `cdn.sanity.io`
- Asegúrate de que las imágenes estén subidas en Sanity

### TypeScript errors
Los errores de TypeScript mostrados son normales antes de instalar dependencias.
Después de `npm install`, todos se resolverán.

## 🎉 ¡Listo!

Tu portfolio está configurado y listo para personalizar.

**Próximos pasos recomendados:**
1. ✅ Instalar dependencias
2. ✅ Configurar Sanity
3. ✅ Agregar tu contenido
4. ✅ Personalizar colores/fuentes
5. ✅ Desplegar a Vercel

## 💬 Soporte

Si tienes preguntas:
- Revisa la documentación completa
- Abre un issue en GitHub
- Consulta la documentación de [Next.js](https://nextjs.org/docs)
- Consulta la documentación de [Sanity](https://www.sanity.io/docs)

---

**¡Mucha suerte con tu portfolio! 🚀**
