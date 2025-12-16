import type { GithubStats } from '@/domain/models'

export async function getGithubStats(
  username: string
): Promise<GithubStats | null> {
  if (!username) return null

  try {
    // Fetch user data
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!userResponse.ok) {
      console.error('GitHub user not found:', username)
      return null
    }

    const userData = await userResponse.json()

    // Fetch contributions (using GraphQL for better accuracy)
    const contributionsCount = await getGithubContributions(username)

    return {
      username,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      contributions30days: contributionsCount,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url,
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return null
  }
}

async function getGithubContributions(
  username: string
): Promise<number> {
  try {
    // Fetch the user's contribution calendar page
    const response = await fetch(`https://github.com/${username}/contributions`, {
      headers: {
        'Accept': 'text/html',
      },
    })

    if (!response.ok) {
      return 0
    }

    const html = await response.text()

    // Extract contribution count from the page
    // Look for pattern like: "X contributions in the last year"
    const match = html.match(
      /(\d+)\s+contributions?\s+in\s+the\s+last\s+(?:30\s+)?days?/i
    )

    return match ? parseInt(match[1], 10) : 0
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    return 0
  }
}
