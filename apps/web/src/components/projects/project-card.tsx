"use client";

import Image from "next/image";
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";
import { Button } from "@/components/ui/button";

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/80 text-left shadow-lg shadow-black/5 backdrop-blur-md"
    >
      <div className="relative h-60 w-full overflow-hidden border-b border-border/50">
        {project.preview ? (
          <Image
            src={project.preview}
            alt={`${project.title} preview`}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-secondary via-muted to-secondary/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full border border-white/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white/90">
          {project.year}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{project.subtitle}</p>
          <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border/70 px-3 py-1 text-[0.65rem]"
            >
              {tech}
            </span>
          ))}
        </div>

        <p className="text-sm font-medium text-foreground">{project.metrics}</p>

        <div className="mt-auto flex items-center gap-3">
          {project.links.live && (
            <Button
              variant="default"
              size="sm"
              className="rounded-full"
              asChild
            >
              <a href={project.links.live} target="_blank" rel="noreferrer">
                Launch case study
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.links.repo && (
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <a href={project.links.repo} target="_blank" rel="noreferrer">
                View code
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

