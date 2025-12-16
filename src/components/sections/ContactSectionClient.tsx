'use client'

import { motion } from 'framer-motion'
import type { ContactInfo, GithubStats } from '@/domain/models'
import ContactCardsGrid from './ContactCardsGrid'

interface ContactSectionClientProps {
  contactInfo: ContactInfo
  githubStats: GithubStats | null
}

export default function ContactSectionClient({
  contactInfo,
  githubStats,
}: ContactSectionClientProps) {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-brand-surfaceDark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-brand-text dark:text-white mb-2">
            {contactInfo.headline}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {contactInfo.subtitle}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <ContactCardsGrid
          contactInfo={contactInfo}
          githubStats={githubStats}
        />
      </div>
    </section>
  )
}
