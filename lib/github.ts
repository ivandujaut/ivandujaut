import { unstable_cache } from "next/cache";

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const REVALIDATE_SECONDS = 60 * 60 * 6; // 6 horas

interface GitHubStats {
  totalCommits: number;
  totalStars: number;
  publicRepos: number;
  topLanguages: { name: string; percentage: number }[];
}

interface GitHubError {
  error: true;
}

export type GitHubResult = GitHubStats | GitHubError;

/**
 * Fetch de stats agregados de GitHub usando GraphQL.
 * Cacheado por 6 horas para no agotar rate limit.
 */
export const getGitHubStats = unstable_cache(
  async (): Promise<GitHubResult> => {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username || !token) {
      console.warn("GitHub credentials not configured");
      return { error: true };
    }

    try {
      const query = `
        query UserStats($username: String!) {
          user(login: $username) {
            contributionsCollection {
              totalCommitContributions
            }
            repositories(
              first: 100
              ownerAffiliations: OWNER
              privacy: PUBLIC
              orderBy: { field: STARGAZERS, direction: DESC }
            ) {
              totalCount
              nodes {
                stargazerCount
                primaryLanguage {
                  name
                }
                languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch(GITHUB_GRAPHQL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const user = data.data.user;
      if (!user) throw new Error("User not found");

      // Total stars sumando todos los repos
      const totalStars = user.repositories.nodes.reduce(
        (sum: number, repo: { stargazerCount: number }) => sum + repo.stargazerCount,
        0,
      );

      // Top lenguajes por bytes totales
      const languageBytes: Record<string, number> = {};
      for (const repo of user.repositories.nodes) {
        for (const edge of repo.languages.edges) {
          languageBytes[edge.node.name] = (languageBytes[edge.node.name] || 0) + edge.size;
        }
      }

      const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);

      const topLanguages = Object.entries(languageBytes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, bytes]) => ({
          name,
          percentage: Math.round((bytes / totalBytes) * 100),
        }));

      return {
        totalCommits: user.contributionsCollection.totalCommitContributions,
        totalStars,
        publicRepos: user.repositories.totalCount,
        topLanguages,
      };
    } catch (error) {
      console.error("Failed to fetch GitHub stats:", error);
      return { error: true };
    }
  },
  ["github-stats"],
  { revalidate: REVALIDATE_SECONDS },
);
