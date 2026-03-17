'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiTrendingUp } from 'react-icons/fi'
import { commercialTokens } from './commercialTokens'

interface InsightBoxProps {
  text: string
}

const InsightBox: React.FC<InsightBoxProps> = ({ text }) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.aside
      className={commercialTokens.insightBox}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-primary/20" />
      <div className="relative flex items-start gap-4">
        <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-secondary/30 bg-brand-secondary/15 text-brand-secondary">
          <FiTrendingUp className="h-5 w-5" aria-hidden="true" />
        </div>
        <blockquote className="relative border-l-2 border-brand-primary pl-4 text-lg md:text-xl text-gray-100 leading-relaxed">
          “{text}”
        </blockquote>
      </div>
    </motion.aside>
  )
}

export default InsightBox
