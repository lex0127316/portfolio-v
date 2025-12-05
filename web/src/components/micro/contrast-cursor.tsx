"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

type ContrastCursorProps = {
  size?: number;
  className?: string;
};

export function ContrastCursor({ size = 32, className }: ContrastCursorProps) {
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number>();
  const targetRef = React.useRef({ x: -100, y: -100 });
  const currentRef = React.useRef({ x: -100, y: -100 });
  const [isEnabled, setIsEnabled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || coarsePointer) {
      return;
    }
    setIsEnabled(true);
  }, []);

  React.useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }
    const body = document.body;
    body.classList.add("custom-cursor-active");

    const render = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      cursor.style.setProperty("--cursor-x", `${current.x - size / 2}px`);
      cursor.style.setProperty("--cursor-y", `${current.y - size / 2}px`);
      rafRef.current = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      cursor.dataset.visible = "true";
    };

    const handlePointerLeave = () => {
      delete cursor.dataset.visible;
    };

    const handlePointerDown = () => {
      cursor.style.setProperty("--cursor-scale", "0.8");
    };

    const handlePointerUp = () => {
      cursor.style.setProperty("--cursor-scale", "1");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      cursor.style.removeProperty("--cursor-scale");
      cursor.style.removeProperty("--cursor-x");
      cursor.style.removeProperty("--cursor-y");
      delete cursor.dataset.visible;
      body.classList.remove("custom-cursor-active");
    };
  }, [isEnabled, size]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className={cn("contrast-cursor", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}


