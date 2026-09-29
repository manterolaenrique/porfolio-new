'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useContactInteraction } from '@/hooks/useContactInteraction'

interface StatusTimezoneCardProps {
  timezone: string
  businessHoursStart: string
  businessHoursEnd: string
}

const StatusTimezoneCard: React.FC<StatusTimezoneCardProps> = ({
  timezone,
  businessHoursStart,
  businessHoursEnd,
}) => {
  const { getWorkingHoursStatus, getStatusColor } = useContactInteraction()

  const [status, setStatus] = useState<
    'available' | 'outside' | 'unknown'
  >('unknown')
  const [currentTime, setCurrentTime] = useState('--:--')
  const statusColor = getStatusColor(status)
  const message =
    status === 'available'
      ? '\u{1F7E2} Disponible ahora'
      : status === 'outside'
        ? '\u{1F534} Fuera del horario'
        : '\u26AA Estado desconocido'

  // Formatear zona horaria
  const formatTimezone = (tz: string) => {
    const parts = tz.split('/')
    return parts[parts.length - 1].replace(/_/g, ' ')
  }

  useEffect(() => {
    const updateAvailability = () => {
      setStatus(
        getWorkingHoursStatus(timezone, businessHoursStart, businessHoursEnd)
      )

      try {
        setCurrentTime(
          new Intl.DateTimeFormat('es-AR', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(new Date())
        )
      } catch {
        setCurrentTime('--:--')
      }
    }

    updateAvailability()
    const interval = setInterval(updateAvailability, 60000)

    return () => clearInterval(interval)
  }, [
    businessHoursEnd,
    businessHoursStart,
    getWorkingHoursStatus,
    timezone,
  ])
  const pulseAnimation = status === 'available'

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-white/5 to-white/10 dark:from-gray-800/20 dark:to-gray-700/20 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Status Dot */}
        <motion.div
          animate={pulseAnimation ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: statusColor }}
        />

        <div>
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
            {formatTimezone(timezone)}
          </p>
          <p className="text-sm font-medium text-brand-text dark:text-white">
            {currentTime}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
          {businessHoursStart} - {businessHoursEnd}
        </p>
        <p className="text-xs font-semibold">{message}</p>
      </div>
    </motion.div>
  )
}

export default StatusTimezoneCard
