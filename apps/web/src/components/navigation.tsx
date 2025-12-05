"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagneticButton } from "@/components/micro/magnetic-button";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold">
            LC
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground">{siteConfig.location}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative"
              aria-label={`Jump to ${link.label} section`}
            >
              <span className="text-muted-foreground transition hover:text-foreground">
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MagneticButton
            className="hidden text-xs uppercase tracking-[0.2em] md:inline-flex"
            icon={<ArrowUpRight className="h-4 w-4" />}
            aria-label="View availability"
          >
            Available Q1
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}

