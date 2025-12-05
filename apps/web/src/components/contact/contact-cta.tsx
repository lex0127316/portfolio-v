"use client";

import { useId, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { MagneticButton } from "@/components/micro/magnetic-button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function ContactCTA() {
  const formId = useId();

  return (
    <section id="contact" className="grid gap-8 rounded-3xl border border-border/60 bg-card/80 p-6 md:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Let’s build</p>
        <h2 className="text-3xl font-semibold">Two partnership slots left for Q1 2026</h2>
        <p className="text-base text-muted-foreground">
          I lead strategy, engineering, and motion craft for teams shipping category-defining tools.
          Send context and I’ll respond with a tailored roadmap in 48 hours.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <a
            className="flex items-center gap-2 text-foreground"
            href={`mailto:${siteConfig.contact.email}`}
          >
            <Mail className="h-4 w-4" />
            {siteConfig.contact.email}
          </a>
          <p>{siteConfig.location}</p>
        </div>
        <MagneticButton icon={<ArrowUpRight className="h-4 w-4" />} className="rounded-full">
          Book a chemistry call
        </MagneticButton>
      </div>

      <motion.form
        className="space-y-5 overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-b from-white/95 via-white/85 to-slate-100 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-8 dark:border-white/10 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-900/40 dark:shadow-[0_40px_120px_rgba(2,6,23,0.65)] dark:backdrop-blur-2xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        id={formId}
      >
        <HaloField
          id={`${formId}-name`}
          label="Your name"
          placeholder="Alex Founder"
          required
        />
        <HaloField
          id={`${formId}-company`}
          label="Company / Product"
          placeholder="Neural Atlas"
        />
        <HaloField
          id={`${formId}-brief`}
          label="Mission"
          placeholder="What do you want to ship in the next 90 days?"
          as="textarea"
        />
        <HaloButton>
          <Send className="h-4 w-4" />
          Send intro
        </HaloButton>
        <p className="text-xs text-muted-foreground">
          This form is wired to your preferred CMS or can post directly to the Edge runtime.
        </p>
      </motion.form>
    </section>
  );
}

type HaloFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  as?: "input" | "textarea";
  required?: boolean;
};

function HaloField({ id, label, placeholder, as = "input", required }: HaloFieldProps) {
  const isTextarea = as === "textarea";
  const Component = isTextarea ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="group relative isolate">
        <span
          className="pointer-events-none absolute -inset-4 -z-20 rounded-[2.9rem] opacity-0 blur-3xl transition duration-500 group-hover:opacity-70 group-focus-within:opacity-80"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(14,165,233,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.35), transparent 50%)",
          }}
        />
        <div
          className="relative rounded-[2.6rem] p-[1.5px] shadow-[0_25px_70px_rgba(15,23,42,0.12)] transition duration-300 group-hover:shadow-[0_45px_90px_rgba(14,165,233,0.2)] group-focus-within:shadow-[0_45px_90px_rgba(79,70,229,0.25)] dark:shadow-[0_25px_70px_rgba(3,7,18,0.65)] dark:group-hover:shadow-[0_45px_90px_rgba(14,165,233,0.25)] dark:group-focus-within:shadow-[0_45px_90px_rgba(79,70,229,0.35)]"
          style={{
            background:
              "linear-gradient(130deg, rgba(14,165,233,0.55), rgba(236,72,153,0.4), rgba(59,130,246,0.5))",
          }}
        >
          <div
            className={cn(
              "relative rounded-[2.4rem] border border-white/70 bg-white/95 px-6 text-base text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition duration-300 focus-within:border-sky-400/60 focus-within:bg-white",
              "dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] dark:backdrop-blur-2xl dark:focus-within:border-cyan-200/70 dark:focus-within:bg-slate-950/60",
              isTextarea ? "py-4" : "py-3",
            )}
          >
            <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80 dark:via-white/40" />
            <Component
              id={id}
              required={required}
              placeholder={placeholder}
              className={cn(
                "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-500/70 focus:outline-none",
                "dark:text-white dark:placeholder:text-slate-300/70",
                isTextarea ? "min-h-[6.5rem] resize-none leading-relaxed" : "leading-none",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HaloButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/60 bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_25px_80px_rgba(15,23,42,0.25)] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 focus-visible:ring-offset-white dark:border-white/15 dark:from-violet-500/80 dark:via-indigo-500/80 dark:to-sky-500/80 dark:shadow-[0_35px_90px_rgba(2,6,23,0.7)] dark:focus-visible:ring-offset-slate-950"
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-70" style={{ background: "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.55), transparent 45%)" }} />
      <span className="pointer-events-none absolute inset-[2px] rounded-full border border-white/40 bg-white/20 dark:border-white/25 dark:bg-slate-950/30" />
      <span className="relative flex items-center gap-2 text-sm font-semibold">
        {children}
      </span>
    </button>
  );
}

