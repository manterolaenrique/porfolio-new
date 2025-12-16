import React from 'react'
import { cn } from '@/utils/cn'

interface TagProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'neutral'
  className?: string
}

const Tag: React.FC<TagProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    primary: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    secondary: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
    neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Tag
