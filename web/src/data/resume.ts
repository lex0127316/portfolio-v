import { siteConfig } from "@/config/site";

type ResumeExperience = {
  company: string;
  position: string;
  period: string;
  highlights: string[];
};

type ResumeData = {
  name: string;
  role: string;
  bio: string;
  experience: ResumeExperience[];
  skills: string[];
  social: typeof siteConfig.social & { email: string };
};

export const resumeData: ResumeData = {
  name: siteConfig.name,
  role: siteConfig.title,
  bio: siteConfig.description,
  experience: [
    {
      company: "Horizon Labs · Product Studio",
      position: "Senior Software Engineer / Product Partner",
      period: "2022 — Present",
      highlights: [
        "Led seven AI-native launches with 120hz-ready WebGL front-ends and GSAP timelines.",
        "Introduced performance budgets that held Lighthouse P95 > 95 on every release.",
        "Mentored a hybrid design/engineering pod shipping weekly cinematic updates.",
      ],
    },
    {
      company: "Kinetic Systems",
      position: "Full-Stack Engineer",
      period: "2019 — 2022",
      highlights: [
        "Scaled a React + Node platform from 0 to 250K MAU with zero downtime deploys.",
        "Prototyped 3D onboarding sequences with Three.js that lifted activation by 18%.",
        "Championed typed APIs and design tokens, shrinking regression bugs by 40%.",
      ],
    },
    {
      company: "Independent",
      position: "Creative Technologist",
      period: "2015 — 2019",
      highlights: [
        "Partnered with YC and Seedcamp founders on hero experiences shipped in under 4 weeks.",
        "Built immersive launch sites featured by Awwwards, Muzli, and Sidebar.",
      ],
    },
  ],
  skills: [
    "Next.js",
    "React 19",
    "Three.js",
    "GSAP",
    "TypeScript",
    "Node.js",
    "Edge Rendering",
    "WebGL",
    "Performance Budgets",
    "Design Systems",
    "Team Leadership",
  ],
  social: {
    ...siteConfig.social,
    email: siteConfig.contact.email,
  },
};


