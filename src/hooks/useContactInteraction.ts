'use client'

import { useCallback, useState } from 'react'

interface ContactInteractionState {
  copiedEmail: boolean
  interactionType: string | null
  lastInteractionTime: number | null
}

/**
 * Hook que gestiona la lógica compartida de interacciones de contacto
 */
export function useContactInteraction() {
  const [state, setState] = useState<ContactInteractionState>({
    copiedEmail: false,
    interactionType: null,
    lastInteractionTime: null,
  })

  // Detectar si está en horario de negocio
  const getWorkingHoursStatus = useCallback(
    (timezone: string, startTime: string, endTime: string) => {
      try {
        const now = new Date()

        // Convertir a hora local de la zona horaria
        const timeInTimezone = new Date(
          now.toLocaleString('en-US', { timeZone: timezone })
        )

        const hours = timeInTimezone.getHours()
        const [startHour] = startTime.split(':').map(Number)
        const [endHour] = endTime.split(':').map(Number)

        if (hours >= startHour && hours < endHour) {
          return 'available'
        }
        return 'outside'
      } catch {
        return 'unknown'
      }
    },
    []
  )

  // Obtener color del estado
  const getStatusColor = useCallback(
    (status: 'available' | 'busy' | 'outside' | 'unknown') => {
      const colors = {
        available: '#10b981', // emerald
        busy: '#f59e0b', // amber
        outside: '#6b7280', // gray
        unknown: '#9ca3af', // gray
      }
      return colors[status]
    },
    []
  )

  // Trackear interacción
  const trackInteraction = useCallback((type: string) => {
    setState((prev) => ({
      ...prev,
      interactionType: type,
      lastInteractionTime: Date.now(),
    }))
  }, [])

  // Manejar copia al portapapeles
  const handleCopyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setState((prev) => ({ ...prev, copiedEmail: true }))

        // Reset después de 2 segundos
        setTimeout(() => {
          setState((prev) => ({ ...prev, copiedEmail: false }))
        }, 2000)

        trackInteraction('copy')
        return true
      } catch (err) {
        console.error('Failed to copy:', err)
        return false
      }
    },
    [trackInteraction]
  )

  // Obtener mensaje de disponibilidad
  const getAvailabilityMessage = useCallback(
    (timezone: string, startTime: string, endTime: string) => {
      const status = getWorkingHoursStatus(timezone, startTime, endTime)

      const messages = {
        available: '🟢 Disponible ahora',
        busy: '🟡 Ocupado',
        outside: '🔴 Fuera del horario',
        unknown: '⚪ Estado desconocido',
      }

      return messages[status]
    },
    [getWorkingHoursStatus]
  )

  return {
    state,
    getWorkingHoursStatus,
    getStatusColor,
    trackInteraction,
    handleCopyToClipboard,
    getAvailabilityMessage,
  }
}
