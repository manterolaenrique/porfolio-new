'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ContactGroupCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  glassEffect?: boolean
  expandable?: boolean
}

const ContactGroupCard: React.FC<ContactGroupCardProps> = ({
  title,
  subtitle,
  children,
  className,
  glassEffect = true,
  expandable = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-300'

  const glassStyles = glassEffect
    ? 'bg-white/10 backdrop-blur-md border border-white/20'
    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'

  return (
    <motion.div
      className={cn(baseStyles, glassStyles, 'p-6', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={expandable ? { y: -2 } : {}}
    >
      {/* Header */}
      <div
        className={cn('mb-4 flex items-center justify-between', expandable && 'cursor-pointer')}
        onClick={() => expandable && setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="text-sm font-semibold text-brand-text dark:text-white uppercase tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {expandable && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500"
          >
            ▼
          </motion.div>
        )}
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={expandable && !isExpanded ? 'hidden' : 'visible'}
        className={cn('gap-3 flex flex-col', !expandable && 'flex')}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ContactGroupCard
