'use client'

import React from 'react'
import * as SiIcons from 'react-icons/si'
import * as FaIcons from 'react-icons/fa'
import * as RiIcons from 'react-icons/ri'
import * as MdIcons from 'react-icons/md'

interface IconResolverProps {
  name?: string
  size?: number
  className?: string
}

export const IconResolver: React.FC<IconResolverProps> = ({
  name,
  size = 24,
  className = '',
}) => {
  if (!name) {
    return null
  }

  // Combinar todos los iconos disponibles
  const allIcons = {
    ...SiIcons,
    ...FaIcons,
    ...RiIcons,
    ...MdIcons,
  } as Record<string, React.ComponentType<any>>

  const Icon = allIcons[name]

  if (!Icon) {
    console.warn(`Icon "${name}" not found in react-icons`)
    return null
  }

  return <Icon size={size} className={className} />
}

export default IconResolver
