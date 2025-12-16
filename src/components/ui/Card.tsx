import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover3D?: boolean
  glassEffect?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover3D = false,
  glassEffect = false,
  onClick
}) => {
  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-300'
  
  const glassStyles = glassEffect
    ? 'bg-white/10 backdrop-blur-md border border-white/20'
    : 'bg-white dark:bg-brand-surfaceDark border border-brand-border dark:border-gray-700 shadow-lg'
  
  if (hover3D) {
    return (
      <motion.div
        className={cn(baseStyles, glassStyles, className)}
        whileHover={{
          rotateY: 5,
          rotateX: 5,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={cn(baseStyles, glassStyles, className)} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
