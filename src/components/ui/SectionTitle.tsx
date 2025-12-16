import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  align = 'center',
  className 
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  
  return (
    <motion.div
      className={cn('mb-12', alignClasses[align], className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-brand-text dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-brand-muted dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex justify-center">
        <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"></div>
      </div>
    </motion.div>
  )
}

export default SectionTitle
