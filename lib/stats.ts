import { getGitHubStats, type GitHubResult } from "./github";
import { getLeetCodeStats, type LeetCodeResult } from "./leetcode";
import { getPosts } from "./content";

export interface AggregatedStats {
  github: GitHubResult;
  leetcode: LeetCodeResult;
  blog: {
    totalPosts: number;
  };
}

/**
 * Agrega stats de todas las fuentes en paralelo.
 * Si alguna falla, devuelve error en esa key específica pero no rompe
 * el resto.
 */
export async function getAllStats(locale: "es" | "en"): Promise<AggregatedStats> {
  const [github, leetcode] = await Promise.all([getGitHubStats(), getLeetCodeStats()]);

  const posts = getPosts(locale);

  return {
    github,
    leetcode,
    blog: {
      totalPosts: posts.length,
    },
  };
}
