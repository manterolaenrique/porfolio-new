'use client'

import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Button from '@/components/ui/Button'
import type {
  CommercialExperienceItem,
  PreSalesCapability,
  TransformationPhase,
} from '@/domain/models'

interface CommercialDecisionHubProps {
  showTransformationRoute?: boolean
  transformationRouteTitle?: string
  transformationRoutePhases?: TransformationPhase[]
  showDecisionHub?: boolean
  decisionHubTitle?: string
  decisionHubSubtitle?: string
  decisionHubClientTypes?: string[]
  decisionHubStages?: string[]
  decisionHubPriorities?: string[]
  experienceItems: CommercialExperienceItem[]
  preSalesCapabilities: PreSalesCapability[]
  ctaLabel?: string
  ctaHref?: string
}

const defaultTimelinePhases: TransformationPhase[] = [
  {
    title: 'Codigo',
    subtitle: 'Base tecnica solida',
    body: 'Arquitectura, calidad y velocidad de ejecucion para construir productos sostenibles.',
    glow: 'from-brand-primary/30 to-transparent',
    order: 1,
  },
  {
    title: 'Negocio',
    subtitle: 'Decisiones con contexto',
    body: 'Priorizacion por impacto comercial real y alineacion con objetivos de negocio.',
    glow: 'from-brand-secondary/25 to-transparent',
    order: 2,
  },
  {
    title: 'Preventa',
    subtitle: 'Puente cliente-equipo',
    body: 'Traduccion de necesidades a alcance viable para cerrar mejor y reducir friccion.',
    glow: 'from-brand-primarySoft/25 to-transparent',
    order: 3,
  },
  {
    title: 'Impacto',
    subtitle: 'Resultado medible',
    body: 'Combinacion de experiencia de usuario, ejecucion tecnica y valor tangible.',
    glow: 'from-brand-secondary/30 to-transparent',
    order: 4,
  },
]

const CommercialDecisionHub: React.FC<CommercialDecisionHubProps> = ({
  showTransformationRoute = true,
  transformationRouteTitle,
  transformationRoutePhases,
  showDecisionHub = true,
  decisionHubTitle,
  decisionHubSubtitle,
  decisionHubClientTypes,
  decisionHubStages,
  decisionHubPriorities,
  experienceItems,
  preSalesCapabilities,
  ctaLabel,
  ctaHref,
}) => {
  const reduceMotion = useReducedMotion()

  const routePhases =
    transformationRoutePhases && transformationRoutePhases.length > 0
      ? transformationRoutePhases
      : defaultTimelinePhases

  const clientTypes =
    decisionHubClientTypes && decisionHubClientTypes.length > 0
      ? decisionHubClientTypes
      : ['Startup', 'PyME', 'Corporativo']

  const stages =
    decisionHubStages && decisionHubStages.length > 0
      ? decisionHubStages
      : ['Discovery', 'Propuesta', 'Entrega']

  const priorities =
    decisionHubPriorities && decisionHubPriorities.length > 0
      ? decisionHubPriorities
      : ['Velocidad', 'Reducir riesgo', 'Claridad tecnica']

  const [activePhase, setActivePhase] = useState(0)
  const [businessType, setBusinessType] = useState(clientTypes[0])
  const [stage, setStage] = useState(stages[0])
  const [priority, setPriority] = useState(priorities[0])

  const businessTypeIndex = Math.max(clientTypes.indexOf(businessType), 0)
  const stageIndex = Math.max(stages.indexOf(stage), 0)
  const priorityIndex = Math.max(priorities.indexOf(priority), 0)

  const recommendation = useMemo(() => {
    const experienceCount = Math.max(experienceItems.length, 1)
    const preSalesCount = Math.max(preSalesCapabilities.length, 1)

    const weight = businessTypeIndex + stageIndex + priorityIndex

    const experienceIndex = weight % experienceCount
    const preSalesIndex = (weight + 1) % preSalesCount

    return {
      experience: experienceItems[experienceIndex],
      preSales: preSalesCapabilities[preSalesIndex],
      summary: `Para ${businessType} en etapa ${stage}, priorizo ${priority.toLowerCase()} con una hoja de ruta comercial-tecnica concreta.`,
    }
  }, [
    businessType,
    stage,
    priority,
    businessTypeIndex,
    stageIndex,
    priorityIndex,
    experienceItems,
    preSalesCapabilities,
  ])

  const currentPhase = routePhases[activePhase]
  const progressPercent =
    routePhases.length > 1
      ? (activePhase / (routePhases.length - 1)) * 100
      : 0

  return (
    <div className="space-y-8">
      {showTransformationRoute && (
      <div className="rounded-2xl border border-white/10 bg-brand-surfaceDark/80 p-5 md:p-6">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
            {transformationRouteTitle || 'Ruta de transformacion'}
          </p>

          <div className="relative mb-4 px-2">
            <div className="h-1.5 rounded-full bg-white/10" />
            <motion.div
              className="absolute left-2 top-0 h-1.5 rounded-full bg-gradient-to-r from-brand-primary via-brand-primarySoft to-brand-secondary"
              initial={false}
              animate={{
                width:
                  progressPercent <= 0 ? '0%' : `calc(${progressPercent}% - 4px)`,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
            />
            {!reduceMotion && (
              <motion.span
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-brand-primary/50 bg-brand-primarySoft shadow-[0_0_16px_rgba(56,189,248,0.6)]"
                initial={false}
                animate={{ left: `calc(${progressPercent}% + 2px)` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                aria-hidden="true"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {routePhases.map((phase, index) => {
              const isCompleted = index <= activePhase
              return (
                <button
                  key={phase.title}
                  type="button"
                  onClick={() => setActivePhase(index)}
                  className={`group rounded-xl border p-2 text-left transition-colors ${
                    isCompleted
                      ? 'border-brand-primary/40 bg-brand-primary/10 text-white'
                      : 'border-white/15 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                        isCompleted
                          ? 'bg-brand-primary text-white'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{phase.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {phase.subtitle}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
          <motion.div
            key={`glow-${currentPhase.title}`}
            className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${currentPhase.glow || 'from-brand-primary/30 to-transparent'}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase.title}
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, x: -18 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="relative"
            >
              <p className="text-xs uppercase tracking-wider text-brand-primarySoft mb-1">
                {currentPhase.subtitle}
              </p>
              <p className="text-gray-100">{currentPhase.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      )}

      {showDecisionHub && (
      <div className="rounded-2xl border border-white/10 bg-brand-surfaceDark/80 p-5 md:p-6">
        <h4 className="text-xl md:text-2xl font-semibold text-white mb-2">
          {decisionHubTitle || 'Mesa de decision comercial (20s)'}
        </h4>
        <p className="text-sm text-gray-300 mb-4">
          {decisionHubSubtitle || 'Elegi contexto y obtene una recomendacion de enfoque para este escenario.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectorGroup
            label="Tipo de cliente"
            options={clientTypes.map((item) => ({ value: item, label: item }))}
            value={businessType}
            onChange={(value) => setBusinessType(value)}
          />

          <SelectorGroup
            label="Etapa"
            options={stages.map((item) => ({ value: item, label: item }))}
            value={stage}
            onChange={(value) => setStage(value)}
          />

          <SelectorGroup
            label="Prioridad"
            options={priorities.map((item) => ({ value: item, label: item }))}
            value={priority}
            onChange={(value) => setPriority(value)}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${businessType}-${stage}-${priority}`}
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? {} : { opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="mt-5 rounded-xl border border-brand-primary/30 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 p-4 md:p-5"
          >
            <p className="text-sm md:text-base text-gray-100 mb-3">{recommendation.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendation.experience && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="rounded-lg border border-white/10 bg-black/15 p-3"
                >
                  <p className="text-xs uppercase tracking-wider text-brand-primarySoft mb-1">
                    Experiencia clave
                  </p>
                  <p className="font-medium text-white">{recommendation.experience.title}</p>
                  <p className="text-sm text-gray-300 mt-1">{recommendation.experience.description}</p>
                </motion.div>
              )}

              {recommendation.preSales && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.08 }}
                  className="rounded-lg border border-white/10 bg-black/15 p-3"
                >
                  <p className="text-xs uppercase tracking-wider text-brand-primarySoft mb-1">
                    Accion de preventa
                  </p>
                  <p className="font-medium text-white">{recommendation.preSales.title}</p>
                  <p className="text-sm text-gray-300 mt-1">{recommendation.preSales.description}</p>
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                href={ctaHref || '#contact'}
                asLink
                className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
              >
                {ctaLabel || 'Hablemos de tu caso'}
              </Button>
              <a
                href="#contact"
                className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
              >
                Ver enfoque completo
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      )}
    </div>
  )
}

interface SelectorGroupProps {
  label: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
}

const SelectorGroup: React.FC<SelectorGroupProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="rounded-lg border border-white/10 bg-black/10 p-3">
      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              value === option.value
                ? 'border-brand-primary bg-brand-primary/20 text-white'
                : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CommercialDecisionHub