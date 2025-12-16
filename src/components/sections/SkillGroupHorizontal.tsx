'use client'

import React from 'react'
import Card from '@/components/ui/Card'
import IconResolver from '@/components/ui/IconResolver'
import { SkillGroup } from '@/domain/models'
import { sortSkillsByLevel } from '@/utils/skillSorter'

interface SkillGroupHorizontalProps {
  group: SkillGroup
}

const SkillGroupHorizontal: React.FC<SkillGroupHorizontalProps> = ({ group }) => {
  // Ordenar skills por nivel (sin mostrar nivel)
  const sortedSkills = sortSkillsByLevel(group.skills)
  const skillNames = sortedSkills.map(s => s.name).join(', ')

  return (
    <Card className="p-6 flex gap-6 items-start hover:shadow-lg transition-shadow">
      {/* Icon Section */}
      {group.icon && (
        <div className="flex-shrink-0">
          <IconResolver
            name={group.icon}
            size={48}
            className="text-brand-primary flex-shrink-0 mt-1"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xl font-semibold text-brand-primary mb-2">
          {group.title}
        </h4>
        <p className="text-brand-muted dark:text-gray-400 leading-relaxed">
          {skillNames}
        </p>
      </div>
    </Card>
  )
}

export default SkillGroupHorizontal
