'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useContactInteraction } from '@/hooks/useContactInteraction'

interface InteractiveEmailCardProps {
  email: string
}

const InteractiveEmailCard: React.FC<InteractiveEmailCardProps> = ({ email }) => {
  const { handleCopyToClipboard, state } = useContactInteraction()
  const [showTooltip, setShowTooltip] = React.useState(false)

  const handleCopy = async () => {
    await handleCopyToClipboard(email)
  }

  const handleOpen = () => {
    window.location.href = `mailto:${email}`
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      className="flex gap-2"
    >
      {/* Copy Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex-1 px-4 py-3 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
      >
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: state.copiedEmail ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          📋 Copiar
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: state.copiedEmail ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          ✓ ¡Copiado!
        </motion.span>

        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-gray-900 text-white text-xs rounded pointer-events-none"
          >
            {email}
          </motion.div>
        )}
      </motion.button>

      {/* Open Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleOpen}
        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-brand-text dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        ✉️ Enviar
      </motion.button>
    </motion.div>
  )
}

export default InteractiveEmailCard
