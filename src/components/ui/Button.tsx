import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  href?: string
  asLink?: boolean
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, href, asLink = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-brand-primary text-white hover:bg-brand-primarySoft focus:ring-brand-primary shadow-lg shadow-brand-primary/30',
      secondary: 'bg-brand-secondary text-white hover:opacity-90 focus:ring-brand-secondary shadow-lg shadow-brand-secondary/30',
      outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary',
      ghost: 'text-brand-text hover:bg-brand-bgSoft focus:ring-brand-primary',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }
    
    const classes = cn(baseStyles, variants[variant], sizes[size], className)
    
    if (href || asLink) {
      return (
        <motion.a
          href={href}
          className={classes}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </motion.a>
      )
    }
    
    return (
      <motion.button
        className={classes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as any)}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
