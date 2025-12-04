export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  preview: string;
  tech: string[];
  metrics: string;
  year: string;
  links: {
    live?: string;
    repo?: string;
  };
};

export const fallbackProjects: Project[] = [
  {
    slug: "neural-atlas",
    title: "Neural Atlas",
    subtitle: "Spatial AI research platform",
    description:
      "Command-center for climate researchers with multi-layer 3D cartography, GPU-powered analytics, and real-time collaboration powered by CRDTs.",
    preview:
      "https://images.unsplash.com/photo-1482192597420-4817fdd7e8b0?auto=format&fit=crop&w=1200&q=80",
    tech: ["Next.js 16", "Three.js", "Turbopack", "Wasmtime"],
    metrics: "↑ 38% research throughput · 420ms median query",
    year: "2025",
    links: {
      live: "https://neural-atlas.ai",
    },
  },
  {
    slug: "synaptic-os",
    title: "Synaptic OS",
    subtitle: "AI-native founder cockpit",
    description:
      "Composable operating system for post-product-market-fit founders: AI copilots, KPI command palette, and event-driven automations.",
    preview:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    tech: ["Next.js", "Convex", "LangGraph", "Edge Functions"],
    metrics: "↓ 64% ops toil · 11k weekly automations",
    year: "2024",
    links: {
      live: "https://synaptic.os",
    },
  },
  {
    slug: "kinetic-commerce",
    title: "Kinetic Commerce",
    subtitle: "Immersive retail twin",
    description:
      "Three.js-powered retail twin with volumetric renders, predictive inventory, and GSAP microinteractions tuned for 144hz displays.",
    preview:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
    tech: ["Three.js", "GSAP", "Cloudflare Workers"],
    metrics: "↑ 52% conversion · 99 Lighthouse performance",
    year: "2024",
    links: {
      live: "https://kinetic-commerce.studio",
    },
  },
  {
    slug: "orbit-flow",
    title: "Orbit Flow",
    subtitle: "Realtime collaboration canvas",
    description:
      "WebGPU canvas for systems teams to storyboard complex infra rollouts, synced via WebRTC mesh and resilient CRDT storage.",
    preview:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tech: ["Next.js", "WebGPU", "Liveblocks", "Tailwind"],
    metrics: "250k frames/sim · 0 dropped frames on M3",
    year: "2023",
    links: {
      live: "https://orbitflow.dev",
    },
  },
];

