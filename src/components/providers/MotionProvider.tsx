'use client'

import { MotionConfig } from 'framer-motion'

interface MotionProviderProps {
  children: React.ReactNode
}

export default function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
