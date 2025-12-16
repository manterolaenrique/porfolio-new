'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface EmailCardProps {
  email: string
}

const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleOpen = () => {
    window.location.href = `mailto:${email}`
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
        <div className="text-5xl">📧</div>

        <div>
          <h3 className="font-semibold text-brand-text dark:text-white">
            Email
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 break-all mt-1">
            {email}
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-brand-text dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="flex-1 px-3 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Abrir
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default EmailCard
