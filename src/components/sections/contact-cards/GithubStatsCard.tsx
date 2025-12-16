'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { GithubStats } from '@/domain/models'

interface GithubStatsCardProps {
  stats: GithubStats
}

const GithubStatsCard: React.FC<GithubStatsCardProps> = ({ stats }) => {
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
        <div className="text-5xl">🐙</div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="font-semibold text-brand-text dark:text-white">
            GitHub Activity
          </h3>
          {stats.avatarUrl && (
            <Image
              src={stats.avatarUrl}
              alt={stats.username}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            @{stats.username}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full text-center">
          <div>
            <p className="text-xl font-bold text-brand-primary">
              {stats.publicRepos}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Repos</p>
          </div>
          <div>
            <p className="text-xl font-bold text-brand-primary">
              {stats.followers}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Followers
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-brand-primary">
              {stats.contributions30days}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cons.</p>
          </div>
        </div>

        <motion.a
          href={stats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-brand-text dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          Ver Perfil →
        </motion.a>
      </div>
    </motion.div>
  )
}

export default GithubStatsCard
