import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Crafted with Next.js, Three.js, and GSAP.
        </p>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
          Always be shipping
        </p>
      </div>
    </footer>
  );
}

