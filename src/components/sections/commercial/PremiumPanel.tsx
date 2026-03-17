'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { commercialTokens } from './commercialTokens'

interface PremiumPanelProps {
  title: string
  body: any[]
}

const PremiumPanel: React.FC<PremiumPanelProps> = ({ title, body }) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className={commercialTokens.premiumPanel}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-primary to-brand-secondary" />
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      <div className="prose prose-lg prose-invert max-w-none text-gray-200">
        <PortableText value={body} />
      </div>
    </motion.div>
  )
}

export default PremiumPanel
