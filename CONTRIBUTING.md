# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Guías de Estilo](#guías-de-estilo)
- [Proceso de Pull Request](#proceso-de-pull-request)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que respetes este código.

## 🤝 ¿Cómo puedo contribuir?

### Reportar Bugs

Los bugs se rastrean como issues de GitHub. Para reportar uno:

1. **Verifica** que no exista ya un issue similar
2. **Usa un título claro** y descriptivo
3. **Describe los pasos** para reproducir el problema
4. **Explica el comportamiento esperado** vs el actual
5. **Incluye capturas** si es posible

### Sugerir Mejoras

Las sugerencias también se rastrean como issues:

1. **Usa un título claro** y descriptivo
2. **Describe detalladamente** la mejora
3. **Explica por qué** sería útil
4. **Menciona alternativas** que hayas considerado

### Tu Primera Contribución de Código

¿No sabes por dónde empezar? Busca issues etiquetados como:
- `good-first-issue` - Problemas simples, ideales para empezar
- `help-wanted` - Issues que necesitan atención

### Pull Requests

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```
3. **Haz commits** con mensajes claros
4. **Push** a tu fork
5. **Abre un Pull Request**

## 🎨 Guías de Estilo

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añade nueva sección de testimonios
fix: corrige bug en navegación mobile
docs: actualiza README con nueva info
style: formatea código en HeroSection
refactor: simplifica lógica de filtrado
test: añade tests para ProjectCard
chore: actualiza dependencias
```

### Código TypeScript

- Usa **TypeScript** para todo
- Define **interfaces** para props
- Evita `any` - usa tipos específicos
- Documenta funciones complejas con JSDoc

```typescript
/**
 * Fetches featured projects from Sanity
 * @returns Promise with array of featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  // ...
}
```

### Componentes React

- Usa **functional components** con hooks
- **Nombra** componentes con PascalCase
- **Exporta** componentes por defecto al final
- **Agrupa** props relacionadas en interfaces

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children }) => {
  // ...
}

export default Button
```

### Estilos

- Usa **TailwindCSS** para estilos
- **Extrae** clases repetidas a componentes
- Usa **cn()** para clases condicionales
- Mantén **consistencia** en espaciado

```typescript
import { cn } from '@/utils/cn'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

### Estructura de Archivos

```
src/
├── app/              # Páginas Next.js
├── components/
│   ├── layout/      # Componentes de layout
│   ├── sections/    # Secciones de página
│   └── ui/          # Componentes UI reutilizables
├── domain/          # Modelos y tipos
├── services/        # Lógica de negocio
└── utils/           # Utilidades
```

## 🔄 Proceso de Pull Request

1. **Actualiza tu fork** antes de empezar
   ```bash
   git pull upstream main
   ```

2. **Asegúrate** de que tu código:
   - ✅ Compila sin errores (`npm run build`)
   - ✅ Pasa el linter (`npm run lint`)
   - ✅ Sigue las guías de estilo
   - ✅ Incluye comentarios si es necesario

3. **Escribe un buen mensaje** en el PR:
   - Describe qué cambia y por qué
   - Referencia issues relacionados
   - Incluye capturas si hay cambios visuales

4. **Responde a comentarios** de manera constructiva

5. **Actualiza** el PR si se solicitan cambios

## ❓ ¿Preguntas?

Si tienes dudas, abre un issue con la etiqueta `question`.

## 🙏 Agradecimientos

¡Gracias por contribuir al proyecto! Cada contribución, grande o pequeña, es valiosa.
