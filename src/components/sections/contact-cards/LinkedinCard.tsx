'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface LinkedinCardProps {
  url: string
}

const LinkedinCard: React.FC<LinkedinCardProps> = ({ url }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow flex-1 flex flex-col"
    >
      <div className="flex flex-col items-center text-center gap-4 h-full justify-between">
        <div className="text-5xl">💼</div>

        <div>
          <h3 className="font-semibold text-brand-text dark:text-white">
            LinkedIn
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Mi Perfil Profesional
          </p>
        </div>

        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Ir a Perfil →
        </motion.a>
      </div>
    </motion.div>
  )
}

export default LinkedinCard
