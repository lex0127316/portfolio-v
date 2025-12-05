export type Milestone = {
  id: string;
  title: string;
  company: string;
  timeframe: string;
  summary: string;
  highlights: string[];
};

const CURRENT_YEAR = new Date().getFullYear();
const EXPERIENCE_START_YEAR = 2017;

const formatDurationLabel = (startYear: number, endYear?: number) => {
  const effectiveEndYear = typeof endYear === "number" ? endYear : CURRENT_YEAR;
  const duration = Math.max(effectiveEndYear - startYear, 0);
  if (duration === 0) return "<1 yr";
  return `${duration} yr${duration === 1 ? "" : "s"}`;
};

const formatTimeframe = (startYear: number, endYear?: number) => {
  const endLabel = typeof endYear === "number" ? `${endYear}` : "Present";
  const durationLabel = formatDurationLabel(startYear, endYear);
  return `${startYear} — ${endLabel} · ${durationLabel}`;
};

type MilestoneConfig = Omit<Milestone, "timeframe"> & {
  startYear: number;
  endYear?: number;
};

const milestoneConfigs: MilestoneConfig[] = [
  {
    id: "atlas-labs",
    title: "Senior Software Engineer — Atlas Labs",
    company: "Climate AI studio",
    startYear: 2023,
    summary: `Lead engineer for a real-time spatial analytics platform delivering climate intelligence to sustainability teams, spanning Next.js App Router, Rust workers, and cinematic WebGL—backed by ${CURRENT_YEAR - EXPERIENCE_START_YEAR}+ years of hands-on experience.`,
    highlights: [
      "Reduced map interaction latency by 45% by moving geospatial queries to edge KV + Rust workers",
      "Bootstrapped AI copilots with Vercel server actions, LangGraph, and Retrieval QA guardrails",
      "Cut platform error budget burn by 60% with canary deploys, SLO alerts, and Playwright smoke suites",
    ],
  },
  {
    id: "stripe",
    title: "Senior Software Engineer — Stripe",
    company: "Product Experience",
    startYear: 2020,
    endYear: 2023,
    summary:
      "Owned mission-critical Dashboard surfaces that serve 2M+ merchants, balancing shipping velocity with a <1s FCP performance budget.",
    highlights: [
      "Rebuilt onboarding funnels on React Server Components + streaming SSR to meet global perf targets",
      "Rolled out Module Federation-based micro frontends with automated contract tests in CI",
      "Mentored 12 engineers through promotion packets and instituted an IC4→IC5 growth framework",
    ],
  },
  {
    id: "ideo",
    title: "Senior Design Engineer — IDEO Futures",
    company: "Innovation Lab",
    startYear: 2017,
    endYear: 2020,
    summary:
      "Delivered production-ready prototypes for Nike, Airbnb, and BMW combining TypeScript, physical computing, and real-time graphics.",
    highlights: [
      "Built GLSL shader pipelines and Node-based controllers for narrative installations deployed worldwide",
      "Co-authored an accessibility playbook that standardized motion + haptics patterns across the lab",
      "Spoke at Figma Config and Google I/O on blending hardware, WebGL, and tangible interactions",
    ],
  },
];

export const totalExperienceYears = Math.max(CURRENT_YEAR - EXPERIENCE_START_YEAR, 0);

export const experienceTimeline: Milestone[] = milestoneConfigs.map(
  ({ startYear, endYear, ...rest }) => ({
    ...rest,
    timeframe: formatTimeframe(startYear, endYear),
  })
);

