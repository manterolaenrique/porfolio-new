'use client'

import React from 'react'
import { motion } from 'framer-motion'
import SkillGroupHorizontal from '@/components/sections/SkillGroupHorizontal'
import { SkillGroup } from '@/domain/models'

interface SkillsSectionProps {
  skillGroups: SkillGroup[]
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
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
      {skillGroups.map((group) => (
        <motion.div key={group._id} variants={itemVariants}>
          <SkillGroupHorizontal group={group} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default SkillsSection
