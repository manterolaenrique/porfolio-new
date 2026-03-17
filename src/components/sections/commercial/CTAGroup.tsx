'use client'

import React from 'react'
import Button from '@/components/ui/Button'
import { commercialTokens } from './commercialTokens'

interface CTAGroupProps {
  primaryLabel?: string
  primaryHref?: string
}

const CTAGroup: React.FC<CTAGroupProps> = ({ primaryLabel, primaryHref }) => {
  if (!primaryLabel || !primaryHref) return null

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button href={primaryHref} asLink className={commercialTokens.ctaPrimary}>
        {primaryLabel}
      </Button>
      <a href="#contact" className={commercialTokens.ctaSecondary}>
        Cómo trabajo con clientes
      </a>
    </div>
  )
}

export default CTAGroup
