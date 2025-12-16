'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimezoneCardProps {
  timezone: string
  businessHoursStart: string
  businessHoursEnd: string
}

const TimezoneCard: React.FC<TimezoneCardProps> = ({
  timezone,
  businessHoursStart,
  businessHoursEnd,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat('es-AR', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        const timeStr = formatter.format(now)
        setCurrentTime(timeStr)
      } catch (error) {
        console.error('Error formatting time:', error)
        setCurrentTime('--:--')
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [timezone])

  // Get UTC offset from timezone
  const getUTCOffset = (): string => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset',
      })
      const parts = formatter.formatToParts(new Date())
      const tzPart = parts.find((p) => p.type === 'timeZoneName')
      return tzPart?.value || 'UTC'
    } catch {
      return 'UTC'
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-shadow h-full"
    >
      <div className="flex flex-col items-center text-center gap-4 h-full justify-between">
        <div className="text-5xl">🌍</div>

        <div>
          <h3 className="font-semibold text-brand-text dark:text-white">
            Zona Horaria
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {mounted ? getUTCOffset() : 'UTC'}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 w-full space-y-2">
          <div>
            <p className="text-2xl font-bold text-brand-primary">
              {mounted ? currentTime : '--:--'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hora actual
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Mejor horario:
            </p>
            <p className="text-sm font-medium text-brand-text dark:text-white">
              {businessHoursStart} - {businessHoursEnd}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TimezoneCard
