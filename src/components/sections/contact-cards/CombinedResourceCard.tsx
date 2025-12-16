'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CVPlaceholderAnimation from '@/components/ui/CVPlaceholderAnimation'
import { getImageUrl, isValidImageSource } from '@/utils/sanityImageUrl'

interface CombinedResourceCardProps {
  cvFile: {
    asset: {
      url: string
      filename: string
      size: number
    }
  }
  cvTitle: string
  email: string
  name: string
  linkedinUrl: string
  showQRCode: boolean
  cvPreviewImage?: {
    asset?: {
      url: string
      _id: string
    }
  }
}

const CombinedResourceCard: React.FC<CombinedResourceCardProps> = ({
  cvFile,
  cvTitle,
  email,
  name,
  linkedinUrl,
  showQRCode,
  cvPreviewImage,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Effect para procesar URL de imagen de Sanity
  useEffect(() => {
    if (cvPreviewImage) {
      if (isValidImageSource(cvPreviewImage)) {
        const url = getImageUrl(cvPreviewImage)
        setImageUrl(url)
      }
    } else {
      setImageUrl(null)
    }
  }, [cvPreviewImage])

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      window.open(cvFile.asset.url, '_blank')
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cv_download', {
          filename: cvFile.asset.filename,
        })
      }
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  // Generar QR data URL (usando qr-code.react)
  // Para este componente, usaremos un placeholder visual

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      className="col-span-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-white dark:from-gray-800 to-white dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
        whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      >
        {/* Left: CV Info */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-4 tracking-wide">
              📄 Recursos
            </p>
            <h3 className="text-2xl font-bold text-brand-text dark:text-white mb-2">
              {cvTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Descarga mi CV completo con experiencia, educación y proyectos
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {formatFileSize(cvFile.asset.size)}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 mt-4"
          >
            <motion.span
              animate={{ opacity: isDownloading ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              📥 Descargar CV
            </motion.span>
            <motion.span
              animate={{ opacity: isDownloading ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              Descargando...
            </motion.span>
          </motion.button>
        </div>

        {/* Right: CV Preview Image or Placeholder Animation */}
        {showQRCode && (
          <motion.div
            className="flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {imageUrl && !imageError ? (
              // ✅ Mostrar imagen si existe URL válida
              <motion.div
                className="w-full h-96 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={imageUrl}
                  alt="CV Preview"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onLoad={() => {
                    setImageLoaded(true)
                  }}
                  onError={() => {
                    setImageError(true)
                  }}
                />
              </motion.div>
            ) : (
              // ❌ Mostrar animación si no existe imagen o hay error
              <CVPlaceholderAnimation size="medium" />
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CombinedResourceCard
