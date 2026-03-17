'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Tag from '@/components/ui/Tag'
import type { CommercialProfile } from '@/domain/models'
import SectionShell from './commercial/SectionShell'
import SectionHeader from './commercial/SectionHeader'
import PremiumPanel from './commercial/PremiumPanel'
import FeatureCard from './commercial/FeatureCard'
import InsightBox from './commercial/InsightBox'
import CTAGroup from './commercial/CTAGroup'
import CommercialDecisionHub from './commercial/CommercialDecisionHub'

interface CommercialProfileSectionProps {
  data: CommercialProfile
}

const CommercialProfileSection: React.FC<CommercialProfileSectionProps> = ({ data }) => {
  const reduceMotion = useReducedMotion()

  if (!data || !data.isEnabled) return null

  const sectionId = data.anchorId || 'business-vision'
  const subtitle =
    data.sectionSubtitle ||
    'Una evolución natural de mi perfil: tecnología con criterio de negocio y foco en personas.'

  return (
    <SectionShell id={sectionId}>
      <SectionHeader title={data.sectionTitle} subtitle={subtitle} />

      <div className="space-y-10">
        <PremiumPanel title="Introducción personal" body={data.introNarrative} />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-5">
            Revolucion comercial: de experiencia a decision
          </h3>
          <CommercialDecisionHub
            showTransformationRoute={data.showTransformationRoute}
            transformationRouteTitle={data.transformationRouteTitle}
            transformationRoutePhases={data.transformationRoutePhases}
            showDecisionHub={data.showDecisionHub}
            decisionHubTitle={data.decisionHubTitle}
            decisionHubSubtitle={data.decisionHubSubtitle}
            decisionHubClientTypes={data.decisionHubClientTypes}
            decisionHubStages={data.decisionHubStages}
            decisionHubPriorities={data.decisionHubPriorities}
            experienceItems={data.experienceItems}
            preSalesCapabilities={data.preSalesCapabilities}
            ctaLabel={data.ctaLabel}
            ctaHref={data.ctaHref}
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-5">
            Conexión con ventas técnicas y preventa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.preSalesCapabilities.map((capability, index) => (
              <FeatureCard
                key={`${capability.title}-${capability.order}`}
                title={capability.title}
                description={capability.description}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        <InsightBox text={data.evolutionStatement} />

        <motion.div
          className="rounded-2xl border border-white/10 bg-brand-surfaceDark/80 p-7 md:p-8 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-4">Roles objetivo</h3>
          {data.targetRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {data.targetRoles.map((role) => (
                <Tag key={role} variant="primary">
                  {role}
                </Tag>
              ))}
            </div>
          )}
          <CTAGroup primaryLabel={data.ctaLabel} primaryHref={data.ctaHref} />
        </motion.div>
      </div>
    </SectionShell>
  )
}

export default CommercialProfileSection