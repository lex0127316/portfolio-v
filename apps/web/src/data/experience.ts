export type Milestone = {
  id: string;
  title: string;
  company: string;
  timeframe: string;
  summary: string;
  highlights: string[];
};

export const experienceTimeline: Milestone[] = [
  {
    id: "atlas-labs",
    title: "Principal Engineer — Atlas Labs",
    company: "Climate AI studio",
    timeframe: "2023 — Present",
    summary:
      "Leading a multi-disciplinary team shipping a real-time spatial analytics platform for climate intelligence, blending RSC, edge caching, and cinematic WebGL.",
    highlights: [
      "Scaled design system across 4 product lines with shadcn primitives",
      "Launched AI copilots with Vercel server actions + LangGraph",
      "Cut TTFB by 63% via streaming SSR and granular revalidation",
    ],
  },
  {
    id: "stripe",
    title: "Staff Engineer — Stripe",
    company: "Product Experience",
    timeframe: "2020 — 2023",
    summary:
      "Architected component APIs that power Dashboard, Terminal, and Identity. Led performance budget initiative focused on <1s FCP globally.",
    highlights: [
      "Rolled out micro-frontend orchestration with Module Federation",
      "Invented animation guidelines using GSAP timelines + Rive",
      "Mentored 12 engineers, built ladder for IC4→IC6 progression",
    ],
  },
  {
    id: "ideo",
    title: "Design Engineer — IDEO Futures",
    company: "Innovation Lab",
    timeframe: "2016 — 2020",
    summary:
      "Shipped immersive prototypes for Nike, Airbnb, and BMW blending hardware, projection mapping, WebGL, and tangible interactions.",
    highlights: [
      "Built custom GLSL shader pipeline for narrative installations",
      "Published accessibility playbook for experiential interfaces",
      "Spoke at Figma Config & Google I/O on multi-modal prototyping",
    ],
  },
];

