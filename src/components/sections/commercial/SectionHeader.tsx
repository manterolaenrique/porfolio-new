'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiZap } from 'react-icons/fi'
import { commercialTokens } from './commercialTokens'

interface SectionHeaderProps {
  title: string
  subtitle?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  const reduceMotion = useReducedMotion()

  return (
    <div className="mb-12 text-center">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <button type="button" className={commercialTokens.badge}>
          <FiZap className="h-4 w-4" aria-hidden="true" />
          <span>2026 • Nuevo enfoque</span>
        </button>
      </motion.div>

      <motion.h2
        className={`${commercialTokens.headerTitle} mt-5`}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={`${commercialTokens.headerSubtitle} mt-4`}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}

      <div className="mt-6 flex justify-center">
        <motion.div
          className="h-1 rounded-full bg-gradient-to-r from-brand-primary via-brand-primarySoft to-brand-secondary"
          initial={reduceMotion ? false : { width: 0, opacity: 0 }}
          whileInView={reduceMotion ? {} : { width: 120, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
        />
      </div>
    </div>
  )
}

export default SectionHeader
