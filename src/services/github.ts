import type { GithubDailyCommit, GithubStats } from '@/domain/models'

const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_GRAPHQL_URL = `${GITHUB_API_URL}/graphql`
const BUENOS_AIRES_TIMEZONE = 'America/Argentina/Buenos_Aires'

interface GithubUserResponse {
  public_repos: number
  followers: number
  html_url: string
  avatar_url: string
}

interface GithubRepoResponse {
  stargazers_count?: number
}

interface GithubCommitContribution {
  occurredAt: string
  commitCount: number
}

interface GithubGraphqlResponse {
  data?: {
    user?: {
      contributionsCollection: {
        totalCommitContributions: number
        commitContributionsByRepository: Array<{
          contributions: {
            nodes: GithubCommitContribution[]
          }
        }>
      }
    }
  }
  errors?: Array<{ message: string }>
}

interface GithubCommitSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: Array<{
    sha: string
    commit: {
      author: {
        date: string
      } | null
    }
  }>
}

interface GithubActivity {
  commitsThisMonth: number | null
  dailyCommits: GithubDailyCommit[]
  activityStatus: GithubStats['activityStatus']
}

export async function getGithubStats(
  username: string
): Promise<GithubStats | null> {
  if (!username) return null

  try {
    const token = process.env.GITHUB_TOKEN
    const headers = getGithubHeaders(token)

    const userResponse = await fetch(
      `${GITHUB_API_URL}/users/${username}`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    )

    if (!userResponse.ok) {
      console.error('GitHub user not found:', username)
      return null
    }

    const userData = (await userResponse.json()) as GithubUserResponse
    const [activity, totalStars] = await Promise.all([
      getGithubMonthlyActivity(username, token),
      getGithubTotalStars(username, headers),
    ])

    return {
      username,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      commitsThisMonth: activity.commitsThisMonth,
      dailyCommits: activity.dailyCommits,
      activityStatus: activity.activityStatus,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url,
      totalStars,
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return null
  }
}

function getGithubHeaders(token?: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function getBuenosAiresDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BUENOS_AIRES_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  ) as Record<'year' | 'month' | 'day', string>
}

function buildMonthDays(year: string, month: string, day: string) {
  return Array.from({ length: Number(day) }, (_, index) => ({
    date: `${year}-${month}-${String(index + 1).padStart(2, '0')}`,
    count: 0,
  }))
}

function mapDailyCommits(
  emptyDays: GithubDailyCommit[],
  commitsByDate: Map<string, number>
) {
  return emptyDays.map((item) => ({
    ...item,
    count: commitsByDate.get(item.date) || 0,
  }))
}

async function getGithubMonthlyActivity(
  username: string,
  token?: string
): Promise<GithubActivity> {
  const now = new Date()
  const { year, month, day } = getBuenosAiresDateParts(now)
  const emptyDays = buildMonthDays(year, month, day)

  if (!token) {
    return {
      commitsThisMonth: null,
      dailyCommits: emptyDays,
      activityStatus: 'unavailable',
    }
  }

  const query = `
    query PortfolioGithubActivity($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          commitContributionsByRepository(maxRepositories: 100) {
            contributions(first: 31, orderBy: { field: OCCURRED_AT, direction: ASC }) {
              nodes {
                occurredAt
                commitCount
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        ...getGithubHeaders(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
          from: `${year}-${month}-01T00:00:00-03:00`,
          to: now.toISOString(),
        },
      }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`GitHub GraphQL responded with ${response.status}`)
    }

    const payload = (await response.json()) as GithubGraphqlResponse
    const collection = payload.data?.user?.contributionsCollection

    if (!collection || payload.errors?.length) {
      throw new Error(payload.errors?.[0]?.message || 'GitHub activity unavailable')
    }

    const commitsByDate = new Map<string, number>()
    collection.commitContributionsByRepository.forEach(({ contributions }) => {
      contributions.nodes.forEach(({ occurredAt, commitCount }) => {
        const date = occurredAt.slice(0, 10)
        commitsByDate.set(date, (commitsByDate.get(date) || 0) + commitCount)
      })
    })

    const graphqlActivity: GithubActivity = {
      commitsThisMonth: collection.totalCommitContributions,
      dailyCommits: mapDailyCommits(emptyDays, commitsByDate),
      activityStatus: 'available',
    }

    const searchedActivity = await getGithubCommitSearchActivity(
      username,
      token,
      year,
      month,
      day,
      emptyDays
    )

    return (searchedActivity.commitsThisMonth || 0) >
      (graphqlActivity.commitsThisMonth || 0)
      ? searchedActivity
      : graphqlActivity
  } catch (error) {
    console.error('Error fetching GitHub monthly activity:', error)

    try {
      return await getGithubCommitSearchActivity(
        username,
        token,
        year,
        month,
        day,
        emptyDays
      )
    } catch (searchError) {
      console.error('Error searching GitHub commits:', searchError)
      return {
        commitsThisMonth: null,
        dailyCommits: emptyDays,
        activityStatus: 'unavailable',
      }
    }
  }
}

async function getGithubCommitSearchActivity(
  username: string,
  token: string,
  year: string,
  month: string,
  day: string,
  emptyDays: GithubDailyCommit[]
): Promise<GithubActivity> {
  const commitsBySha = new Map<string, string>()
  let page = 1
  let totalCount = 0

  do {
    const query = `author:${username} author-date:${year}-${month}-01..${year}-${month}-${day}`
    const searchParams = new URLSearchParams({
      q: query,
      per_page: '100',
      page: String(page),
    })
    const response = await fetch(
      `${GITHUB_API_URL}/search/commits?${searchParams.toString()}`,
      {
        headers: getGithubHeaders(token),
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub commit search responded with ${response.status}`)
    }

    const payload = (await response.json()) as GithubCommitSearchResponse
    totalCount = Math.min(payload.total_count, 1000)
    payload.items.forEach((item) => {
      const date = item.commit.author?.date.slice(0, 10)
      if (date) commitsBySha.set(item.sha, date)
    })
    page += 1
  } while (commitsBySha.size < totalCount && page <= 10)

  const commitsByDate = new Map<string, number>()
  commitsBySha.forEach((date) => {
    commitsByDate.set(date, (commitsByDate.get(date) || 0) + 1)
  })

  return {
    commitsThisMonth: commitsBySha.size,
    dailyCommits: mapDailyCommits(emptyDays, commitsByDate),
    activityStatus: 'available',
  }
}

async function getGithubTotalStars(
  username: string,
  headers: HeadersInit
): Promise<number> {
  try {
    let totalStars = 0
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await fetch(
        `${GITHUB_API_URL}/users/${username}/repos?per_page=100&page=${page}`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      )

      if (!response.ok) {
        break
      }

      const repos = (await response.json()) as GithubRepoResponse[]

      if (repos.length === 0) {
        hasMore = false
        break
      }

      totalStars += repos.reduce(
        (sum, repo) => sum + (repo.stargazers_count || 0),
        0
      )

      if (repos.length < 100) {
        hasMore = false
      }

      page++
    }

    return totalStars
  } catch (error) {
    console.error('Error fetching GitHub total stars:', error)
    return 0
  }
}
