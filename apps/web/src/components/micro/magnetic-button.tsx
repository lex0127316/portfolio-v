"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
};

export function MagneticButton({
  children,
  className,
  icon,
  ...props
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-15, 15], [6, -6]);
  const rotateY = useTransform(x, [-15, 15], [-6, 6]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX / 4);
    y.set(offsetY / 4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_rgba(59,130,246,0.35)] transition hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      style={{ x, y, rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
      {...props}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-sky-400/30 to-purple-500/20 opacity-0 transition group-hover:opacity-100"
      />
      <span className="relative flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}

