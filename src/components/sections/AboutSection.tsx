'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import SkillsSection from '@/components/sections/SkillsSection'
import { About as AboutType } from '@/domain/models'

interface AboutSectionProps {
  data: AboutType
}

const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  if (!data) return null

  return (
    <section id="about" className="py-20 bg-white dark:bg-brand-surfaceDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={data.title}
          subtitle="Conoce más sobre mí y mis habilidades"
        />

        {/* TOP SECTION: Intro + Skills (lado a lado) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* LEFT: Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8">
            <p className="text-xl text-brand-primary font-semibold mb-6">
              {data.intro}
            </p>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={data.body} />
            </div>
          </Card>
        </motion.div>

        {/* RIGHT: Skills Section (Vertical) */}
        {data.skillGroups && data.skillGroups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SkillsSection skillGroups={data.skillGroups} />
          </motion.div>
        )}
      </div>

      {/* BOTTOM SECTION: Stats Bar (Horizontal) */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Years of Experience */}
        <Card className="p-6 text-center" glassEffect>
          <div className="text-5xl font-bold text-brand-primary mb-2">
            {data.yearsExperience}+
          </div>
          <p className="text-brand-muted dark:text-gray-400">
            Años de Experiencia
          </p>
        </Card>

        {/* Current City */}
        {data.currentCity && (
          <Card className="p-6 text-center" glassEffect>
            <div className="text-2xl font-bold text-brand-text dark:text-white mb-2">
              📍 {data.currentCity}
            </div>
            <p className="text-brand-muted dark:text-gray-400">
              Ubicación Actual
            </p>
          </Card>
        )}
      </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
