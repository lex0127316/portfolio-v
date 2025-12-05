"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  experienceTimeline,
  Milestone,
  totalExperienceYears,
} from "@/data/experience";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
type Props = {
  items?: Milestone[];
};

export function ExperienceTimeline({ items = experienceTimeline }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-timeline-item]", {
          opacity: 0,
          x: -30,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        });
        gsap.from("[data-timeline-line]", {
          scaleY: 0,
          transformOrigin: "top",
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        });
      }, containerRef);
      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <section id="about" className="space-y-8" ref={containerRef}>
      <div className="relative isolate flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-border/60 dark:bg-card/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
          Trajectory
        </p>
        <h2 className="text-3xl font-semibold text-foreground">
          {totalExperienceYears}+ years building futures at scale
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          From IDEO installations to Stripe’s dashboard and climate intelligence OSs, I partner
          deeply, measure obsessively, and lead with storytelling.
        </p>
      </div>

      <div className="relative pl-8">
        <div
          data-timeline-line
          className="absolute left-2 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-primary/40 to-transparent md:block"
        />
        <div className="space-y-8">
          {items.map((milestone) => (
            <article
              key={milestone.id}
              data-timeline-item
              className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-inner shadow-black/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">{milestone.title}</p>
                <p>{milestone.timeframe}</p>
              </div>
              <p className="text-sm text-muted-foreground">{milestone.company}</p>
              <p className="mt-3 text-base leading-relaxed text-foreground">{milestone.summary}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {milestone.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

