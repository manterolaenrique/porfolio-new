'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface CVDownloadCardProps {
  cvFile: {
    asset: {
      url: string
      filename: string
      size: number
    }
  }
  cvTitle: string
}

const CVDownloadCard: React.FC<CVDownloadCardProps> = ({
  cvFile,
  cvTitle,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      window.open(cvFile.asset.url, '_blank')
      // Track analytics if available
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow h-full"
    >
      <div className="flex flex-col items-center text-center gap-4 h-full justify-between">
        <div className="text-5xl">📄</div>

        <div>
          <h3 className="font-semibold text-brand-text dark:text-white">
            {cvTitle}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatFileSize(cvFile.asset.size)}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isDownloading ? 'Descargando...' : 'Descargar ↓'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CVDownloadCard
