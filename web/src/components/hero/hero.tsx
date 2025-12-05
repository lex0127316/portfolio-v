"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Download, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/micro/magnetic-button";
import { siteConfig } from "@/config/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const driveLinkToDownloadUrl = (url?: string) => {
  if (!url) {
    return "";
  }

  if (url.includes("uc?export=download")) {
    return url;
  }

  // Extract the Google Drive file ID and reshape to a direct download endpoint.
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }

  try {
    const parsed = new URL(url);
    const idParam = parsed.searchParams.get("id");
    if (idParam) {
      return `https://drive.google.com/uc?export=download&id=${idParam}`;
    }
  } catch {
    return url;
  }

  return url;
};

const RESUME_SOURCE_URL =
  process.env.NEXT_PUBLIC_RESUME_DOWNLOAD_URL ?? siteConfig.resumeDriveShareUrl;
const RESUME_DOWNLOAD_ENDPOINT = driveLinkToDownloadUrl(RESUME_SOURCE_URL);
const RESUME_FILE_NAME =
  process.env.NEXT_PUBLIC_RESUME_FILE_NAME ?? siteConfig.resumeFileName ?? "resume.pdf";

const DynamicHeroScene = dynamic(
  () => import("./three-hero").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse rounded-3xl bg-gradient-to-br from-muted to-card" />,
  },
);

type StatValue = {
  value: string;
  descriptor?: string;
  suffix?: string;
};

type HeroProps = {
  hero: {
    headline: string;
    subheadline: string;
    specialties: string[];
    availability?: string;
  };
  stats: {
    shipped: StatValue;
    performance: StatValue;
    githubStars: StatValue;
  };
};

export function Hero({ hero, stats }: HeroProps) {
  const textRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadFeedback, setDownloadFeedback] = React.useState<{
    tone: "success" | "error" | "info";
    message: string;
  } | null>(null);
  useGSAP(
    () => {
      if (!textRef.current) {
        return;
      }
      gsap.from(textRef.current.querySelectorAll("[data-reveal='text']"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
    },
    { scope: textRef },
  );

  React.useEffect(() => {
    if (!downloadFeedback || downloadFeedback.tone !== "success") {
      return;
    }

    const timeout = window.setTimeout(() => setDownloadFeedback(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [downloadFeedback]);

  const handleResumeDownload = () => {
    if (isDownloading) {
      return;
    }

    if (!RESUME_DOWNLOAD_ENDPOINT) {
      setDownloadFeedback({
        tone: "info",
        message: "Resume link is not configured yet.",
      });
      return;
    }

    setDownloadFeedback(null);
    setIsDownloading(true);

    try {
      const anchor = document.createElement("a");
      anchor.href = RESUME_DOWNLOAD_ENDPOINT;
      anchor.download = RESUME_FILE_NAME;
      anchor.rel = "noopener noreferrer";
      anchor.style.display = "none";

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setDownloadFeedback({
        tone: "success",
        message: "Your download is on its way.",
      });
    } catch (error) {
      console.error("Failed to start resume download", error);
      setDownloadFeedback({
        tone: "error",
        message: "Unable to start the download right now. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white/70 to-sky-50/60 p-6 shadow-[0_30px_110px_rgba(15,23,42,0.1)] dark:from-background dark:via-background/60 dark:to-background/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-10">
      <div className="gradient-backdrop" aria-hidden />
      <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr]" ref={textRef}>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Available for selective partnerships
          </div>
          <div className="space-y-4">
            <h1
              data-reveal="text"
              className="text-4xl font-semibold leading-tight text-balance sm:text-5xl"
            >
              {hero.headline}
            </h1>
            <p data-reveal="text" className="text-base text-muted-foreground sm:text-lg">
              {hero.subheadline}
            </p>
            <ul className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {hero.specialties.map((item) => (
                <li key={item} className="rounded-full border border-border/50 px-4 py-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-4" data-reveal="text">
            <MagneticButton icon={<ArrowRight className="h-4 w-4" />}>
              Book a build week
            </MagneticButton>
            <Button
              variant="outline"
              className="group relative overflow-hidden rounded-full border border-border/70 bg-white/80 px-6 py-2 font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_12px_28px_rgba(59,130,246,0.25)] focus-visible:ring-2 focus-visible:ring-primary/60 dark:bg-black/30 dark:hover:bg-primary/10"
              onClick={handleResumeDownload}
              disabled={isDownloading}
              type="button"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing download…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download resume
                </>
              )}
            </Button>
          </div>
          {downloadFeedback && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm ${
                downloadFeedback.tone === "error"
                  ? "text-red-500 dark:text-red-400"
                  : downloadFeedback.tone === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
              }`}
            >
              {downloadFeedback.message}
            </p>
          )}
          {hero.availability && (
            <p data-reveal="text" className="text-sm text-muted-foreground">
              {hero.availability}
            </p>
          )}
          <div className="grid grid-cols-3 gap-4" data-reveal="text">
            <Stat label="Products shipped" {...stats.shipped} />
            <Stat label="Performance budget" {...stats.performance} />
            <Stat label="Community stars" {...stats.githubStars} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-sky-300/40 via-indigo-200/35 to-purple-200/30 dark:from-blue-500/30 dark:via-indigo-400/20 dark:to-purple-500/30" />
          <div className="relative rounded-[2rem] border border-slate-200/70 bg-white/85 p-1 shadow-[0_35px_120px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-2xl">
            <div className="rounded-[1.7rem] border border-white/80 bg-white p-6 shadow-inner shadow-slate-200/80 dark:border-white/5 dark:bg-black/50 dark:shadow-none">
              <DynamicHeroScene />
            </div>
          </div>
          <div className="mt-4 grid gap-2 rounded-2xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Cinematic WebGL built for focus</p>
            <p>Three.js + GSAP orchestrated for 120hz displays, with reduced-motion fallbacks.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

type StatProps = StatValue & {
  label: string;
};

function Stat({ label, value, descriptor, suffix }: StatProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="flex flex-wrap items-baseline gap-1 text-3xl font-semibold leading-tight text-foreground break-words">
        <span>{value}</span>
        {suffix ? <span className="text-xl font-semibold text-muted-foreground">{suffix}</span> : null}
      </p>
      {descriptor ? <p className="text-sm text-muted-foreground">{descriptor}</p> : null}
    </div>
  );
}

