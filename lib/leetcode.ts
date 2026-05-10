import { unstable_cache } from "next/cache";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const REVALIDATE_SECONDS = 60 * 60 * 6; // 6 horas

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

interface LeetCodeError {
  error: true;
}

export type LeetCodeResult = LeetCodeStats | LeetCodeError;

/**
 * Fetch de stats de LeetCode.
 *
 * IMPORTANTE: LeetCode no tiene API pública oficial. Usamos su endpoint
 * GraphQL interno, que puede cambiar sin aviso. Si se rompe, hay que
 * actualizar la query.
 */
export const getLeetCodeStats = unstable_cache(
  async (): Promise<LeetCodeResult> => {
    const username = process.env.LEETCODE_USERNAME;

    if (!username) {
      console.warn("LeetCode username not configured");
      return { error: true };
    }

    try {
      const query = `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
            }
          }
        }
      `;

      const response = await fetch(LEETCODE_GRAPHQL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com",
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      });

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const user = data.data.matchedUser;
      if (!user) throw new Error("User not found");

      const stats = user.submitStats.acSubmissionNum;

      const findCount = (difficulty: string) =>
        stats.find((s: { difficulty: string; count: number }) => s.difficulty === difficulty)
          ?.count ?? 0;

      return {
        totalSolved: findCount("All"),
        easySolved: findCount("Easy"),
        mediumSolved: findCount("Medium"),
        hardSolved: findCount("Hard"),
        ranking: user.profile.ranking,
      };
    } catch (error) {
      console.error("Failed to fetch LeetCode stats:", error);
      return { error: true };
    }
  },
  ["leetcode-stats"],
  { revalidate: REVALIDATE_SECONDS },
);
