'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { commercialTokens } from './commercialTokens'

interface SectionShellProps {
  id: string
  children: React.ReactNode
}

const SectionShell: React.FC<SectionShellProps> = ({ id, children }) => {
  const reduceMotion = useReducedMotion()

  return (
    <section id={id} className={commercialTokens.section}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="absolute right-10 bottom-10 h-56 w-56 rounded-full bg-brand-secondary/10 blur-3xl" />
      </div>
      <motion.div
        className={commercialTokens.container}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </section>
  )
}

export default SectionShell
