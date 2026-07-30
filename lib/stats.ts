import { getGitHubStats, type GitHubResult } from "./github";
import { getPosts, getProjects } from "./content";

export interface AggregatedStats {
  github: GitHubResult;
  projects: {
    totalProjects: number;
    shipped: number;
  };
  blog: {
    totalPosts: number;
  };
}

/**
 * Agrega stats de todas las fuentes en paralelo.
 * Si alguna falla, devuelve error en esa key específica pero no rompe
 * el resto.
 *
 * Nota: LeetCode quedó fuera de la home a propósito. `lib/leetcode.ts` sigue
 * disponible para reincorporarlo cuando el número sume en vez de restar.
 */
export async function getAllStats(locale: "es" | "en"): Promise<AggregatedStats> {
  const github = await getGitHubStats();

  const posts = getPosts(locale);
  const projects = getProjects(locale);

  return {
    github,
    projects: {
      totalProjects: projects.length,
      shipped: projects.filter((project) => project.status === "shipped").length,
    },
    blog: {
      totalPosts: posts.length,
    },
  };
}
