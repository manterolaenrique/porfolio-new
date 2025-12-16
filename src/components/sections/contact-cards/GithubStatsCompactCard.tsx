'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { GithubStats } from '@/domain/models'

interface GithubStatsCompactCardProps {
  stats: GithubStats
}

const GithubStatsCompactCard: React.FC<GithubStatsCompactCardProps> = ({ stats }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const sparklineData = Array.from({ length: 12 }, (_, i) =>
    Math.floor(Math.random() * stats.contributions30days / 12)
  )

  const maxValue = Math.max(...sparklineData, 1)

  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  const expandVariants = {
    collapsed: { height: 'auto' },
    expanded: { height: 'auto' },
  }

  return (
    <motion.div
      variants={containerVariants}
      className="p-4 bg-gradient-to-br from-gray-50/50 to-gray-50/30 dark:from-gray-800/20 dark:to-gray-700/20 rounded-lg border border-white/10 cursor-pointer flex-1 flex flex-col"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header with Avatar */}
      <div className="flex items-center gap-3 mb-4">
        {stats.avatarUrl && (
          <motion.img
            src={stats.avatarUrl}
            alt={stats.username}
            className="w-10 h-10 rounded-full border-2 border-brand-primary"
            whileHover={{ scale: 1.1 }}
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-brand-text dark:text-white">
            {stats.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">GitHub</p>
        </div>
        <motion.a
          href={stats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ scale: 1.1 }}
          className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Ver
        </motion.a>
      </div>

      {/* Sparkline */}
      <div className="mb-3">
        <div className="flex items-end justify-between h-12 gap-0.5">
          {sparklineData.map((value, index) => (
            <motion.div
              key={index}
              className="flex-1 bg-gradient-to-t from-brand-primary to-brand-primary/60 rounded-sm"
              style={{ height: `${(value / maxValue) * 100}%` }}
              whileHover={{ scaleY: 1.2, originY: 'bottom' }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={expandVariants}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-brand-primary">
              {stats.publicRepos}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Repos</p>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-primary">
              {stats.followers}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Followers
            </p>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-primary">
              {stats.contributions30days}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              30 días
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GithubStatsCompactCard
