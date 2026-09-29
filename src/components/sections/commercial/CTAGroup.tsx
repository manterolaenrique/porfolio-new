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
    <div className="flex justify-center">
      <Button href={primaryHref} asLink className={commercialTokens.ctaPrimary}>
        {primaryLabel}
      </Button>
    </div>
  )
}

export default CTAGroup
