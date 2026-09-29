'use client'

import Image from 'next/image'
import type { GithubStats } from '@/domain/models'

interface GithubStatsCompactCardProps {
  stats: GithubStats
}

const GithubStatsCompactCard = ({ stats }: GithubStatsCompactCardProps) => {
  const activityAvailable = stats.activityStatus === 'available'
  const maxDailyCommits = Math.max(
    ...stats.dailyCommits.map(({ count }) => count),
    1
  )

  return (
    <div className="flex flex-1 flex-col rounded-lg border border-white/10 bg-gradient-to-br from-gray-50/50 to-gray-50/30 p-4 dark:from-gray-800/20 dark:to-gray-700/20">
      <div className="flex items-center gap-3 mb-4">
        {stats.avatarUrl && (
          <Image
            src={stats.avatarUrl}
            alt={stats.username}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-brand-primary"
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-brand-text dark:text-white">
            {stats.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">GitHub</p>
        </div>
        <a
          href={stats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
        >
          Ver
        </a>
      </div>

      <div className="mb-4" aria-label="Actividad diaria de commits del mes">
        {activityAvailable ? (
          <div className="flex h-12 items-end justify-between gap-0.5">
            {stats.dailyCommits.map(({ date, count }) => (
              <div
                key={date}
                className="min-w-0 flex-1 rounded-sm bg-gradient-to-t from-brand-primary to-brand-primary/60"
                style={{
                  height: count === 0 ? '4px' : `${Math.max((count / maxDailyCommits) * 100, 16)}%`,
                  opacity: count === 0 ? 0.25 : 1,
                }}
                title={`${date}: ${count} commit${count === 1 ? '' : 's'}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-12 items-center justify-center rounded border border-dashed border-white/15 text-xs text-gray-500 dark:text-gray-400">
            Actividad no disponible
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
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
            Seguidores
          </p>
        </div>
        <div>
          <p className="text-lg font-bold text-brand-primary">
            {stats.totalStars}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Estrellas</p>
        </div>
        <div>
          <p className="text-lg font-bold text-brand-primary">
            {activityAvailable ? (stats.commitsThisMonth ?? 0) : 'N/D'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Commits este mes
          </p>
        </div>
      </div>
    </div>
  )
}

export default GithubStatsCompactCard
