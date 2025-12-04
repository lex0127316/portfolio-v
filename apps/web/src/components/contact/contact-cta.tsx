"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/micro/magnetic-button";
import { siteConfig } from "@/config/site";

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
        className="space-y-4 rounded-2xl border border-border/60 bg-background/80 p-6 shadow-inner"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        id={formId}
      >
        <div className="space-y-1">
          <label htmlFor={`${formId}-name`} className="text-sm font-medium">
            Your name
          </label>
          <input
            id={`${formId}-name`}
            className="w-full rounded-full border border-border/70 bg-transparent px-4 py-2 text-sm outline-none focus:border-primary"
            placeholder="Alex Founder"
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${formId}-company`} className="text-sm font-medium">
            Company / Product
          </label>
          <input
            id={`${formId}-company`}
            className="w-full rounded-full border border-border/70 bg-transparent px-4 py-2 text-sm outline-none focus:border-primary"
            placeholder="Neural Atlas"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor={`${formId}-brief`} className="text-sm font-medium">
            Mission
          </label>
          <textarea
            id={`${formId}-brief`}
            className="h-28 w-full rounded-3xl border border-border/70 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="What do you want to ship in the next 90 days?"
          />
        </div>
        <Button type="submit" className="w-full rounded-full">
          <Send className="h-4 w-4" />
          Send intro
        </Button>
        <p className="text-xs text-muted-foreground">
          This form is wired to your preferred CMS or can post directly to the Edge runtime.
        </p>
      </motion.form>
    </section>
  );
}

