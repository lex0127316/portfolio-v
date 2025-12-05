"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { cn } from "@/lib/cn";

type MagneticButtonProps = React.ComponentPropsWithoutRef<typeof motion.button> & {
  icon?: React.ReactNode;
  speed?: number;
};

export function MagneticButton({
  children,
  className,
  icon,
  speed = 2,
  type = "button",
  ...props
}: MagneticButtonProps) {
  const content = children as React.ReactNode;
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-15, 15], [6, -6]);
  const rotateY = useTransform(x, [-15, 15], [-6, 6]);
  const normalizedSpeed = Math.max(0.2, speed);

  const cssVarStyles = React.useMemo(
    () =>
      ({
        "--color-1": "hsl(0 100% 63%)",
        "--color-2": "hsl(270 100% 63%)",
        "--color-3": "hsl(210 100% 63%)",
        "--color-4": "hsl(195 100% 63%)",
        "--color-5": "hsl(90 100% 63%)",
        "--speed": `${normalizedSpeed}s`,
      }) as React.CSSProperties,
    [normalizedSpeed],
  );

  const buttonStyle: MotionStyle = {
    ...cssVarStyles,
    x,
    y,
    rotateX,
    rotateY,
  };

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
      type={type}
      className={cn(
        "group relative inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-0 px-8 py-2 text-sm font-semibold text-white transition-[color,background,box-shadow,transform] duration-500 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "shadow-[0_12px_40px_rgba(17,17,17,0.25)] dark:shadow-[0_15px_55px_rgba(0,0,0,0.65)] dark:text-neutral-900",
        "before:pointer-events-none before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:rounded-full before:opacity-70 before:content-['']",
        "before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:bg-[length:200%] before:[animation:rainbow_var(--speed)_linear_infinite] before:[filter:blur(calc(0.8*1rem))]",
        className,
      )}
      style={buttonStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]"
      >
        <span
          className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] opacity-100 transition-opacity duration-700 ease-out dark:opacity-0"
          style={{ backgroundSize: "200%" }}
        />
        <span
          className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] opacity-0 transition-opacity duration-700 ease-out dark:opacity-100"
          style={{ backgroundSize: "200%" }}
        />
      </span>
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="text-lg leading-none" aria-hidden>{icon}</span>}
        <span>{content}</span>
      </span>
    </motion.button>
  );
}

