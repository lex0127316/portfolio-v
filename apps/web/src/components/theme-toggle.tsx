"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const isDark = (theme ?? resolvedTheme) === "dark";

  React.useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      className={cn(
        "relative flex h-10 w-18 items-center justify-between rounded-full border border-border bg-card px-2 text-sm font-medium text-foreground shadow-sm transition hover:border-primary",
        className,
      )}
    >
      <motion.span
        layout
        className="absolute inset-y-1 h-8 w-8 rounded-full bg-primary shadow-lg"
        transition={{ type: "spring", stiffness: 400, damping: 26 }}
        style={{ left: isDark ? "calc(50% + 0.25rem)" : "0.25rem" }}
      />
      <Sun className={cn("z-10 h-4 w-4", { "text-muted-foreground": isDark })} />
      <Moon className={cn("z-10 h-4 w-4", { "text-muted-foreground": !isDark })} />
      {!mounted && (
        <span className="sr-only">
          {isDark ? "Switch to light theme" : "Switch to dark theme"}
        </span>
      )}
    </button>
  );
}

