# 🚀 Portafolio Personal - Enrique Manterola

> Portafolio moderno y responsivo con integración de Sanity CMS, animaciones fluidas y diseño contemporáneo.

![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.14-38B2AC?logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.11.11-purple)
![Sanity](https://img.shields.io/badge/Sanity-3.63.0-FF926A?logo=sanity)

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Desarrollo](#desarrollo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Integración Sanity](#integración-sanity)
- [Deploy](#deploy)
- [Componentes Principales](#componentes-principales)
- [Contacto](#contacto)

## ✨ Características

### 🎨 Diseño & Animaciones
- **Animaciones dinámicas** con Framer Motion
- **Gradientes interactivos** que siguen el cursor
- **Modo oscuro/claro** automático
- **Diseño completamente responsivo**
- **Interfaz moderna** con Tailwind CSS

### 📊 Contenido
- **Hero section** con presentación personalizada
- **Sección About** con especialidades y animaciones
- **Galería de proyectos** destacados
- **Contacto integrado** con múltiples canales
- **Vista previa de CV** desde Sanity
- **Estadísticas de GitHub** en tiempo real

### 🗄️ Backend
- **Sanity CMS** para gestión de contenido
- **Consultas GROQ optimizadas**
- **Imágenes optimizadas** desde Sanity
- **TypeScript** para type safety
- **Revalidación ISR** cada hora

### 🌍 Integración
- **GitHub Stats API** para estadísticas
- **Soporte multi-zona horaria**
- **Analytics con Google Tag Manager** (listo para implementar)
- **SEO optimizado** con metadatos dinámicos

## 🛠️ Tecnologías

### Frontend
```json
{
  "next": "15.0.3",
  "react": "18.3.1",
  "typescript": "5.6.3",
  "tailwindcss": "3.4.14",
  "framer-motion": "11.11.11",
  "@sanity/image-url": "^1.0.2"
}
```

### Backend/CMS
```json
{
  "sanity": "3.63.0",
  "@sanity/client": "^6.24.0"
}
```

### Herramientas
- ESLint para linting
- PostCSS para procesamiento CSS
- Next.js Image Optimization

## 📦 Instalación

### Requisitos Previos
- Node.js 20+ 
- npm o yarn
- Cuenta de Sanity (para CMS)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/enrique-manterola/portfolio.git
cd portfolio
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (ver sección siguiente)

4. **Ejecutar desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=tu_read_token

# GitHub (opcional)
GITHUB_TOKEN=tu_github_token
```

### Obtener credenciales de Sanity

1. Ve a [sanity.io](https://www.sanity.io)
2. Crea un proyecto o usa uno existente
3. En Proyecto → Configuración → API:
   - Project ID: `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - Dataset: generalmente `production`
4. En Tokens: crea un token de lectura y asígnalo a `SANITY_READ_TOKEN`

## 🚀 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Ejecutar servidor de producción
npm run start

# Linting y validación
npm run lint

# Validar tipos TypeScript
npm run type-check
```

### Estructura de Carpetas

```
src/
├── app/
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout global
│   ├── globals.css        # Estilos globales
│   ├── admin/             # Rutas de admin (Sanity Studio)
│   └── projects/          # Páginas dinámicas de proyectos
├── components/
│   ├── layout/            # Componentes de layout
│   ├── sections/          # Secciones principales
│   ├── ui/                # Componentes reutilizables
│   └── contact-cards/     # Tarjetas de contacto
├── services/
│   ├── cms/               # Servicios de Sanity
│   └── github.ts          # Servicio GitHub API
├── utils/
│   ├── cn.ts              # Utilidades de className
│   ├── skillSorter.ts     # Ordenamiento de skills
│   └── sanityImageUrl.ts  # Builder de URLs de Sanity
├── domain/
│   └── models/            # Interfaces TypeScript
└── sanity/
    └── schemas/           # Esquemas de Sanity
```

## 🗂️ Integración Sanity

### Documentos Principales

#### 1. **Información de Contacto**
```groq
*[_type == "contactInfo" && _id == "contactInfo"][0] {
  headline,
  subtitle,
  cvFile,
  cvPreviewImage,
  primaryEmail,
  linkedinUrl,
  timezone,
  businessHoursStart,
  businessHoursEnd,
  ...
}
```

Campos:
- `headline`: Título principal
- `cvFile`: Archivo PDF del CV
- `cvPreviewImage`: Imagen PNG/JPG de vista previa del CV
- `primaryEmail`: Email de contacto
- `linkedinUrl`: URL del perfil LinkedIn
- `timezone`: Zona horaria para mostrar disponibilidad

#### 2. **Hero Section**
```groq
*[_type == "hero"][0] {
  title,
  subtitle,
  ctaText,
  backgroundImage,
  ...
}
```

#### 3. **About Section**
```groq
*[_type == "about"][0] {
  title,
  description,
  highlights[],
  ...
}
```

#### 4. **Proyectos**
```groq
*[_type == "project"] | order(order asc) {
  _id,
  title,
  description,
  image,
  tags[],
  link,
  featured,
  ...
}
```

#### 5. **Skills**
```groq
*[_type == "skillGroup"] {
  title,
  skills[]{
    name,
    level,
    icon,
    ...
  }
}
```

### Actualizaciones en Sanity Studio

1. **Acceder a Sanity Studio**
```bash
npm run studio
```

2. **Publicar documentos** en orden:
   - Hero Section
   - About Section
   - Skills
   - Proyectos
   - Información de Contacto (con CV Preview)

3. **Imágenes Optimizadas**
   - Usar formatos PNG/JPG
   - Tamaños recomendados:
     - CV Preview: 1103x787px
     - Project Images: 1200x600px
     - Hero Background: 1920x1080px

## 🚢 Deploy

### Deploying en Vercel

#### Opción 1: CLI de Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

#### Opción 2: GitHub + Vercel

1. **Push a GitHub**
```bash
git add .
git commit -m "Deploy inicial del portafolio"
git push origin main
```

2. **Conectar en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importa el repositorio de GitHub
   - Agrega variables de entorno:
     - `NEXT_PUBLIC_SANITY_PROJECT_ID`
     - `NEXT_PUBLIC_SANITY_DATASET`
     - `NEXT_PUBLIC_SANITY_API_VERSION`
     - `SANITY_READ_TOKEN`
   - Click en "Deploy"

3. **Actualizaciones automáticas**
   - Cada push a `main` dispara un nuevo deploy
   - Los deployments son automáticos

### Configurar Dominio Personalizado

1. En Vercel → Proyecto → Settings → Domains
2. Agregar dominio personalizado
3. Seguir instrucciones para configurar DNS

## 🎯 Componentes Principales

### InteractiveEmailCard
Tarjeta de email con animaciones y efecto hover.
- Copia email al clipboard
- Efecto ripple on click
- Indicador de disponibilidad

### CombinedResourceCard
Tarjeta de recursos (CV + Preview).
- Vista previa de CV desde Sanity
- Descarga de PDF
- Animación de carga con placeholder
- Responsivo en todos los tamaños

### StatusTimezoneCard
Muestra estado de disponibilidad en tiempo real.
- Hora actual por zona horaria
- Indicador de horas laborales
- Estados: "Disponible", "En horario", "Fuera de horario"

### GithubStatsCompactCard
Estadísticas de GitHub en tiempo real.
- Repositorios públicos
- Followers
- Sparkline de contribuciones

## 🔍 SEO

El portafolio incluye:
- Metadatos dinámicos desde Sanity
- Open Graph Image para redes sociales
- Sitemap automático
- Robots.txt configurado
- Schema.org para Rich Snippets

## 📱 Responsive Design

- **Mobile First**: Diseñado primero para móvil
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Imágenes optimizadas** con Next.js Image

## 🎨 Temas

Soporte para modo oscuro/claro:
- Basado en preferencia del sistema
- Selectable manualmente
- Persisten en localStorage
- Transiciones suaves

## 🐛 Troubleshooting

### La imagen del CV no se muestra
1. Verifica que la imagen esté subida en Sanity
2. Asegúrate que está en el campo `cvPreviewImage`
3. Revisa la consola del navegador para logs de debug
4. Valida que `SANITY_READ_TOKEN` sea correcto

### GitHub Stats no cargan
1. Verifica `GITHUB_TOKEN` en variables de entorno
2. Comprueba que el usuario de GitHub existe
3. Revisa límites de rate limiting de GitHub API

### Styles no aplican correctamente
```bash
# Reconstruir Tailwind CSS
npm run build
```

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Email**: contacto@enriquemanterola.com
- **LinkedIn**: [linkedin.com/in/enriquemanterola](https://linkedin.com/in/enriquemanterola)
- **GitHub**: [@enrique-manterola](https://github.com/enrique-manterola)
- **Portfolio**: [enriquemanterola.com](https://enriquemanterola.com)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Sanity](https://www.sanity.io/) por el CMS
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Framer Motion](https://www.framer.com/motion/) por las animaciones
- [Vercel](https://vercel.com/) por el hosting

---

**Última actualización**: 16 de Diciembre de 2025

Hecho con ❤️ por [Enrique Manterola](https://github.com/enrique-manterola)
