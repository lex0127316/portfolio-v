"use client";

import * as React from "react";

import {
  THEME_TRANSITION_DURATION,
  THEME_TRANSITION_END_EVENT,
  THEME_TRANSITION_START_EVENT,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

export function ThemeTransitionLoader() {
  const [isVisible, setIsVisible] = React.useState(false);
  const hideTimeoutRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const prefersReducedMotionRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const cancelHideTimeout = () => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const cancelAnimation = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const handleTransitionStart = () => {
      if (prefersReducedMotionRef.current) {
        return;
      }
      cancelAnimation();
      cancelHideTimeout();
      rafRef.current = window.requestAnimationFrame(() => {
        setIsVisible(true);
        rafRef.current = null;
        cancelHideTimeout();
        hideTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(false);
          hideTimeoutRef.current = null;
        }, THEME_TRANSITION_DURATION);
      });
    };

    const handleTransitionEnd = () => {
      if (prefersReducedMotionRef.current) {
        cancelAnimation();
        cancelHideTimeout();
        setIsVisible(false);
      }
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = (matches: boolean) => {
      prefersReducedMotionRef.current = matches;
      if (matches) {
        cancelAnimation();
        cancelHideTimeout();
        setIsVisible(false);
      }
    };

    updateMotionPreference(motionQuery.matches);

    const motionListener = (event: MediaQueryListEvent) => updateMotionPreference(event.matches);

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", motionListener);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(motionListener);
    }

    window.addEventListener(THEME_TRANSITION_START_EVENT, handleTransitionStart);
    window.addEventListener(THEME_TRANSITION_END_EVENT, handleTransitionEnd);

    return () => {
      cancelAnimation();
      cancelHideTimeout();
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", motionListener);
      } else if (typeof motionQuery.removeListener === "function") {
        motionQuery.removeListener(motionListener);
      }
      window.removeEventListener(THEME_TRANSITION_START_EVENT, handleTransitionStart);
      window.removeEventListener(THEME_TRANSITION_END_EVENT, handleTransitionEnd);
    };
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        "fixed inset-0 z-[2147483200] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-150 ease-out",
        isVisible ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
      )}
    >
      <span className="sr-only">Switching theme</span>
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    </div>
  );
}

