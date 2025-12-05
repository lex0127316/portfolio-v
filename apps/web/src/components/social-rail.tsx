"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

type SocialRailProps = {
  position?: "left" | "right";
};

const socials = [
  {
    label: "GitHub",
    href: siteConfig.social.github,
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: Linkedin,
  },
  {
    label: "X / Twitter",
    href: siteConfig.social.twitter,
    icon: Twitter,
  },
] as const;

export function SocialRail({ position = "right" }: SocialRailProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [position, x, y]);

  return (
    <div
      ref={constraintsRef}
      className="pointer-events-none fixed inset-0 z-40 hidden lg:block"
      aria-hidden
    >
      <motion.aside
        role="complementary"
        aria-label="Primary social links"
        className={cn(
          "pointer-events-auto absolute flex flex-col items-center gap-3 rounded-full border border-border/70 bg-background/95 p-3 shadow-[0_25px_80px_rgba(15,23,42,0.22)] backdrop-blur",
        )}
        style={{
          top: "calc(50% - 120px)",
          [position]: "1.25rem",
          x,
          y,
        }}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
      >
        {socials.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-card/80 text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <Icon className="h-4 w-4" />
          </Link>
        ))}
        <span className="h-14 w-px bg-border/60" aria-hidden />
      </motion.aside>
    </div>
  );
}


