export type GitHubRepo = {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updatedAt: string;
};

export const fallbackRepos: GitHubRepo[] = [
  {
    name: "nextjs-immersive-starter",
    description: "Production-grade starter that pairs Next.js App Router with Three.js + GSAP.",
    url: "https://github.com/vercel/nextjs-immersive-starter",
    stars: 1240,
    language: "TypeScript",
    updatedAt: "2025-11-18T12:00:00Z",
  },
  {
    name: "motion-recipes",
    description: "Microinteraction recipes for Framer Motion + GSAP hybrid timelines.",
    url: "https://github.com/vercel/motion-recipes",
    stars: 987,
    language: "TypeScript",
    updatedAt: "2025-10-05T12:00:00Z",
  },
  {
    name: "webgl-holodeck",
    description: "Collection of physically based shader studies + R3F patterns.",
    url: "https://github.com/vercel/webgl-holodeck",
    stars: 1560,
    language: "GLSL",
    updatedAt: "2025-09-12T12:00:00Z",
  },
];

