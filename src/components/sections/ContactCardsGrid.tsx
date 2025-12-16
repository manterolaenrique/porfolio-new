'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { ContactInfo, GithubStats } from '@/domain/models'
import ContactGroupCard from '@/components/ui/ContactGroupCard'
import InteractiveEmailCard from './contact-cards/InteractiveEmailCard'
import StatusTimezoneCard from './contact-cards/StatusTimezoneCard'
import GithubStatsCompactCard from './contact-cards/GithubStatsCompactCard'
import LinkedinCard from './contact-cards/LinkedinCard'
import CombinedResourceCard from './contact-cards/CombinedResourceCard'

interface ContactCardsGridProps {
  contactInfo: ContactInfo
  githubStats: GithubStats | null
}

const ContactCardsGrid: React.FC<ContactCardsGridProps> = ({
  contactInfo,
  githubStats,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* GROUP 1: CONTACTO DIRECTO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <ContactGroupCard
          title="Contacto Directo"
          subtitle="Elige cómo prefieres comunicarte"
          glassEffect
        >
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 uppercase font-semibold">
              📧 Email
            </p>
            <InteractiveEmailCard email={contactInfo.primaryEmail} />
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 uppercase font-semibold">
              ⏰ Estado de Disponibilidad
            </p>
            <StatusTimezoneCard
              timezone={contactInfo.timezone}
              businessHoursStart={contactInfo.businessHoursStart}
              businessHoursEnd={contactInfo.businessHoursEnd}
            />
          </div>
        </ContactGroupCard>
      </motion.div>

      {/* GROUP 2: REDES PROFESIONALES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ContactGroupCard
          title="Redes Profesionales"
          subtitle="Conecta conmigo en mis plataformas"
          glassEffect
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase font-semibold">
                💼 LinkedIn
              </p>
              <LinkedinCard url={contactInfo.linkedinUrl} />
            </div>

            {githubStats && (
              <div className="flex flex-col">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase font-semibold">
                  👨‍💻 GitHub
                </p>
                <GithubStatsCompactCard stats={githubStats} />
              </div>
            )}
          </div>
        </ContactGroupCard>
      </motion.div>

      {/* GROUP 3: RECURSOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ContactGroupCard
          title="Recursos"
          subtitle="Descarga mis documentos"
          glassEffect
        >
          <CombinedResourceCard
            cvFile={contactInfo.cvFile}
            cvTitle={contactInfo.cvTitle}
            email={contactInfo.primaryEmail}
            name={contactInfo.fullName}
            linkedinUrl={contactInfo.linkedinUrl}
            showQRCode={contactInfo.showQRCode || false}
            cvPreviewImage={contactInfo.cvPreviewImage}
          />
        </ContactGroupCard>
      </motion.div>
    </motion.div>
  )
}

export default ContactCardsGrid
