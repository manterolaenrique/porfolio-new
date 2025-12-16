'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'

interface QRCodeCardProps {
  email: string
  name: string
  linkedinUrl?: string
}

// Fallback QR generator using a public service
const generateQRUrl = (text: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(text)}`
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  email,
  name,
  linkedinUrl,
}) => {
  const qrRef = useRef<HTMLDivElement>(null)

  // Generate vCard format for QR
  const generateVCard = (): string => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
EMAIL:${email}`

    if (linkedinUrl) {
      vcard += `\nURL:${linkedinUrl}`
    }

    vcard += '\nEND:VCARD'
    return vcard
  }

  const qrValue = generateVCard()

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${name.replace(/\s+/g, '-')}-contacto.png`
      link.click()
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
        <div className="text-5xl">📱</div>

        <div>
          <h3 className="font-semibold text-brand-text dark:text-white">
            Código QR
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Escanea para contactarme
          </p>
        </div>

        <div
          ref={qrRef}
          className="bg-white p-2 rounded-lg inline-block border border-gray-200"
        >
          <img
            src={generateQRUrl(qrValue)}
            alt="QR Code"
            width={140}
            height={140}
            className="w-[140px] h-[140px]"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadQR}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-brand-text dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          Descargar QR
        </motion.button>
      </div>
    </motion.div>
  )
}

export default QRCodeCard
