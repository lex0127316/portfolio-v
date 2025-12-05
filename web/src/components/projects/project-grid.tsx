"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Project, fallbackProjects } from "@/data/projects";
import { GitHubRepo } from "@/data/github";
import { ProjectCard } from "./project-card";

type Props = {
  projects: Project[];
  repos: GitHubRepo[];
};

export function ProjectGrid({ projects = fallbackProjects, repos }: Props) {
  return (
    <section id="work" className="space-y-8">
      <div className="relative isolate flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-border/60 dark:bg-card/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Selected Work</p>
        <h2 className="text-3xl font-semibold text-foreground">Pattern libraries for ambitious founders</h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          Each build blends performance budgets, cinematic aesthetics, and systems thinking. I pair
          Next.js App Router with GSAP + WebGL pipelines to prototype fast and ship confidently.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.slug} />
        ))}
      </div>

      <GitHubActivity repos={repos} />
    </section>
  );
}

function GitHubActivity({ repos }: { repos: GitHubRepo[] }) {
  if (!repos.length) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Live R&D Streams
          </p>
          <h3 className="text-xl font-semibold">Open-sourcing my motion lab</h3>
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {repos.map((repo, index) => (
          <motion.a
            key={repo.url}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-border/60 bg-background/60 p-4 transition hover:border-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
          >
            <p className="text-sm font-semibold text-foreground">{repo.name}</p>
            <p className="text-sm text-muted-foreground">{repo.description}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>★ {repo.stars}</span>
              <span>{repo.language}</span>
              <span>{new Date(repo.updatedAt).toLocaleDateString()}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

