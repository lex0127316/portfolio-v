import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Crafted with Next.js, Three.js, and GSAP.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={siteConfig.social.github} className="hover:text-foreground" target="_blank">
            GitHub
          </Link>
          <Link
            href={siteConfig.social.linkedin}
            className="hover:text-foreground"
            target="_blank"
          >
            LinkedIn
          </Link>
          <Link href={siteConfig.social.twitter} className="hover:text-foreground" target="_blank">
            X/Twitter
          </Link>
        </div>
      </div>
    </footer>
  );
}

