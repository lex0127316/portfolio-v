import "server-only";

import { cache } from "react";
import { fallbackRepos, type GitHubRepo } from "@/data/github";
import { siteConfig } from "@/config/site";

const username = process.env.GITHUB_USERNAME ?? siteConfig.githubUsername;
const token = process.env.GITHUB_TOKEN;

type GitHubAPIRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
};

export const getLatestRepos = cache(async (): Promise<GitHubRepo[]> => {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              "User-Agent": "portfolio-app",
              Accept: "application/vnd.github+json",
            }
          : { "User-Agent": "portfolio-app" },
        next: {
          revalidate: 60 * 30,
          tags: ["github"],
        },
      },
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = (await res.json()) as GitHubAPIRepo[];

    return data.slice(0, 6).map(
      (repo): GitHubRepo => ({
        name: repo.name,
        description: repo.description ?? "No description provided.",
        url: repo.html_url,
        stars: repo.stargazers_count ?? 0,
        language: repo.language ?? "TypeScript",
        updatedAt: repo.updated_at,
      }),
    );
  } catch (error) {
    console.warn("Failed to fetch GitHub activity", error);
    return fallbackRepos;
  }
});

