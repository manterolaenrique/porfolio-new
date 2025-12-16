'use client'

import React from 'react'
import { motion, useTime, useTransform } from 'framer-motion'

interface CVPlaceholderAnimationProps {
  size?: 'small' | 'medium' | 'large'
}

const CVPlaceholderAnimation: React.FC<CVPlaceholderAnimationProps> = ({ size = 'medium' }) => {
  const time = useTime()

  // Rotación base sincronizada
  const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false })

  // Configuración por tamaño
  const sizeConfig = {
    small: {
      container: 'w-32 h-32',
      bigBox: 80,
      medBox: 50,
      smallBox: 30,
      gap: 30,
    },
    medium: {
      container: 'w-48 h-64',
      bigBox: 100,
      medBox: 70,
      smallBox: 40,
      gap: 50,
    },
    large: {
      container: 'w-56 h-80',
      bigBox: 120,
      medBox: 85,
      smallBox: 50,
      gap: 60,
    },
  }

  const config = sizeConfig[size]

  // Estilos base para cajas
  const baseBoxStyle = {
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  }

  // Caja pequeña (rota 2x velocidad)
  const smallBoxStyle = {
    ...baseBoxStyle,
    width: config.smallBox,
    height: config.smallBox,
    opacity: 0.6,
    rotate: useTransform(() => rotate.get() * 2),
  }

  // Caja mediana (rota 1.5x velocidad)
  const medBoxStyle = {
    ...baseBoxStyle,
    width: config.medBox,
    height: config.medBox,
    opacity: 0.8,
    rotate: useTransform(() => rotate.get() * 1.5),
  }

  // Caja grande (rota 1x velocidad)
  const bigBoxStyle = {
    ...baseBoxStyle,
    width: config.bigBox,
    height: config.bigBox,
    opacity: 1,
    rotate,
  }

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const boxContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: config.gap,
    flexWrap: 'wrap',
  }

  return (
    <div className={`relative ${config.container} bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden`}>
      {/* Capa 1: Blur 4px - Esferas pequeñas */}
      <div style={{ ...layerStyle, filter: 'blur(4px)' }}>
        <div style={{ ...boxContainerStyle, width: config.gap * 4 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div key={`small-${i}`} style={smallBoxStyle} />
          ))}
        </div>
      </div>

      {/* Capa 2: Blur 2px - Esferas medianas */}
      <div style={{ ...layerStyle, filter: 'blur(2px)' }}>
        <div style={{ ...boxContainerStyle, width: config.gap * 2.5 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={`med-${i}`} style={medBoxStyle} />
          ))}
        </div>
      </div>

      {/* Capa 3: Sin blur - Esfera grande */}
      <div style={layerStyle}>
        <motion.div style={bigBoxStyle} />
      </div>

      {/* Texto de carga */}
      <motion.div
        style={{ position: 'absolute', bottom: 12, left: 0, right: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center text-xs text-gray-600 dark:text-gray-400 font-semibold"
      >
        Cargando preview...
      </motion.div>
    </div>
  )
}

export default CVPlaceholderAnimation
