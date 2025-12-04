"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const isDark = mounted ? (theme ?? resolvedTheme) === "dark" : false;

  React.useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        className={cn(
          "relative inline-flex h-10 w-[4.5rem] items-center rounded-full border border-border bg-card px-2 opacity-0",
          className,
        )}
      >
        <span className="sr-only">Toggle dark mode</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      className={cn(
        "group relative inline-flex h-10 w-[4.5rem] items-center rounded-full border border-border bg-card p-1 text-foreground shadow-sm transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <motion.span
        layout
        animate={{ x: isDark ? 32 : 0 }}
        className="pointer-events-none absolute inset-y-1 left-1 h-8 w-8 rounded-full bg-primary shadow-lg group-active:scale-[0.97]"
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5 text-xs font-semibold uppercase tracking-wider">
        <Sun
          className={cn("h-4 w-4 transition-colors", {
            "text-background": !isDark,
            "text-muted-foreground": isDark,
          })}
        />
        <Moon
          className={cn("h-4 w-4 transition-colors", {
            "text-muted-foreground": !isDark,
            "text-background": isDark,
          })}
        />
      </span>
      <span className="sr-only">
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </span>
    </button>
  );
}

