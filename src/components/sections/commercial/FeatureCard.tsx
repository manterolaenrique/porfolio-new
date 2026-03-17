'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiBarChart2 } from 'react-icons/fi'
import { commercialTokens } from './commercialTokens'

interface FeatureCardProps {
  title: string
  description: string
  index: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, index }) => {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      className={commercialTokens.featureCard}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div className={commercialTokens.featureIconWrap}>
        <FiBarChart2 className="h-5 w-5" aria-hidden="true" />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2 transition-colors duration-200 group-hover:text-brand-primarySoft">
        {title}
      </h4>
      <p className="text-sm md:text-base leading-relaxed text-gray-300/90">{description}</p>
    </motion.article>
  )
}

export default FeatureCard
