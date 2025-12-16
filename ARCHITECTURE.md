# Arquitectura del Portfolio

## Capas de la Aplicación

### 1. Presentación (`/app` y `/components`)
- **Responsabilidad**: UI y experiencia de usuario
- **Tecnologías**: React, Next.js, Framer Motion
- **Principios**: 
  - Componentes reutilizables
  - Separación de layout, secciones y UI
  - Server Components cuando es posible

### 2. Dominio (`/domain`)
- **Responsabilidad**: Modelos de negocio y tipos
- **Contenido**: Interfaces TypeScript
- **Principios**:
  - Type-safety
  - Independiente de frameworks
  - Contratos claros

### 3. Servicios (`/services`)
- **Responsabilidad**: Integración con APIs externas
- **Contenido**: Cliente Sanity, queries GROQ
- **Principios**:
  - Abstracción de la capa de datos
  - Funciones puras cuando es posible
  - Manejo de errores

### 4. Infraestructura (`/sanity`)
- **Responsabilidad**: Configuración CMS
- **Contenido**: Schemas, validaciones
- **Principios**:
  - Validación en origen
  - Estructura de datos coherente

## Flujo de Datos

```
Usuario → Next.js Page → Service Layer → Sanity API → CMS
                ↓
          Components → UI Rendering → Browser
```

## Decisiones de Arquitectura

### ¿Por qué Server Components?
- Mejora performance (menos JS al cliente)
- Acceso directo a datos en el servidor
- SEO optimizado

### ¿Por qué Sanity?
- Headless CMS flexible
- Portable Text para contenido rico
- API en tiempo real
- Excelente experiencia de editor

### ¿Por qué GROQ?
- Queries potentes y expresivas
- Proyecciones eficientes
- Type-safe con TypeScript

### ¿Por qué TailwindCSS?
- Utility-first approach
- Performance (PurgeCSS integrado)
- Consistencia en diseño
- Dark mode built-in

## Patrones Implementados

### 1. Repository Pattern
- Servicios CMS actúan como repositorios
- Abstracción de la fuente de datos

### 2. Component Composition
- Componentes pequeños y composables
- Props bien definidos
- Single Responsibility

### 3. Dependency Injection
- Datos pasados como props
- Servicios importados donde se necesitan

### 4. Error Boundaries
- Manejo de errores a nivel de página
- Fallbacks informativos

## Extensibilidad

### Agregar nuevas secciones
1. Crear schema en `/sanity/schemas`
2. Crear modelo en `/domain/models`
3. Crear servicio en `/services/cms`
4. Crear componente en `/components/sections`
5. Integrar en `/app/page.tsx`

### Agregar nuevos componentes UI
1. Crear en `/components/ui`
2. Seguir patrón de props consistente
3. Documentar con JSDoc
4. Aplicar animaciones si es necesario

### Cambiar CMS
Gracias a la separación de capas:
1. Crear nuevo servicio en `/services/new-cms`
2. Mantener mismos tipos de dominio
3. Actualizar imports en páginas
4. Sin cambios en componentes

## Testing Strategy

### Recomendaciones
- **Unit Tests**: Servicios y utilidades
- **Integration Tests**: Flujo completo de datos
- **E2E Tests**: Cypress/Playwright para flujos críticos
- **Visual Tests**: Storybook para componentes

## Performance

### Optimizaciones Implementadas
- Image optimization con next/image
- Font optimization con next/font
- Code splitting automático
- ISR (Incremental Static Regeneration)
- Minimal JavaScript al cliente

### Métricas Objetivo
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTI < 3.8s

## Seguridad

### Medidas Implementadas
- Env variables para secrets
- Validación en Sanity schemas
- Sanitización de contenido
- HTTPS en producción
- CSP headers configurables

### Próximos Pasos
- Rate limiting
- Input sanitization adicional
- Security headers completos
