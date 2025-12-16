import { urlFor as sanityUrlFor } from '@/services/cms/sanityClient'

interface SanityAsset {
  _id?: string
  _ref?: string // Referencia de Sanity (ej: "image-xxx")
  url?: string
  metadata?: {
    dimensions?: {
      width: number
      height: number
    }
  }
}

interface SanityImage {
  asset?: SanityAsset | string // Puede ser referencia, URL o objeto completo
  hotspot?: unknown
  crop?: unknown
}

/**
 * Construye una URL optimizada para una imagen de Sanity
 * @param source - Objeto de imagen de Sanity
 * @returns Builder con métodos para URL generation
 * 
 * Ejemplo de uso:
 * urlFor(imageObject).width(200).height(300).url()
 */
export function urlFor(source: SanityImage) {
  return sanityUrlFor(source)
}

/**
 * Obtiene URL simple de una imagen (sin transformaciones)
 * @param source - Objeto de imagen de Sanity
 * @returns URL de la imagen como string
 */
export function getImageUrl(source: SanityImage): string | null {
  if (!source) {
    console.warn('⚠️ source es null o undefined')
    return null
  }

  // Caso 1: asset es directamente una URL string
  if (typeof source.asset === 'string' && source.asset.startsWith('http')) {
    console.log('✅ [getImageUrl] URL directa (string):', source.asset)
    return source.asset
  }

  // Caso 2: asset es un objeto con url (URL resuelta)
  if (typeof source.asset === 'object' && source.asset?.url) {
    const url = source.asset.url as string
    if (url.startsWith('http')) {
      console.log('✅ [getImageUrl] URL desde asset.url:', url)
      return url
    }
  }

  // Caso 3: asset es un objeto con _ref (referencia sin resolver)
  if (typeof source.asset === 'object' && source.asset?._ref) {
    try {
      console.log('🔧 [getImageUrl] Asset con _ref, procesando con imageUrlBuilder:', source.asset._ref)
      const builtUrl = urlFor(source.asset).url()
      console.log('✅ [getImageUrl] URL construida desde _ref:', builtUrl)
      return builtUrl
    } catch (error) {
      console.error('❌ Error building image URL from _ref:', error)
    }
  }

  // Caso 4: asset es un objeto con _id (ID de asset)
  if (typeof source.asset === 'object' && source.asset?._id) {
    try {
      console.log('🔧 [getImageUrl] Procesando con imageUrlBuilder desde _id')
      return urlFor({ asset: source.asset }).url()
    } catch (error) {
      console.error('❌ Error building image URL from _id:', error)
    }
  }

  console.warn('⚠️ No se pudo extraer URL de:', source)
  return null
}

/**
 * Obtiene URL optimizada de una imagen con dimensiones
 * @param source - Objeto de imagen de Sanity
 * @param width - Ancho en píxeles
 * @param height - Alto en píxeles
 * @returns URL optimizada
 */
export function getOptimizedImageUrl(
  source: SanityImage,
  width: number = 220,
  height: number = 300
): string | null {
  if (!source?.asset) {
    return null
  }

  try {
    // ⚠️ IMPORTANTE: Pasar solo el asset al builder
    return urlFor({ asset: source.asset })
      .width(width)
      .height(height)
      .fit('max')
      .auto('format')
      .url()
  } catch (error) {
    console.error('Error building optimized image URL:', error)
    return source.asset.url ?? null
  }
}

/**
 * Valida si un objeto de imagen tiene una fuente válida (URL, _ref o _id)
 * @param source - Objeto de imagen de Sanity
 * @returns true si tiene alguna fuente válida
 */
export function isValidImageSource(source: SanityImage): boolean {
  if (!source?.asset) {
    return false
  }

  // Válido si tiene URL
  if (typeof source.asset === 'string') {
    return source.asset.startsWith('http')
  }

  // Válido si es objeto con url, _ref, o _id
  if (typeof source.asset === 'object') {
    return !!(source.asset.url || source.asset._ref || source.asset._id)
  }

  return false
}
