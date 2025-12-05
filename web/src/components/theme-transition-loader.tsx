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
  const maskId = React.useId();

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
        "fixed inset-0 z-[2147483200] flex items-center justify-center bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/55 transition-opacity duration-150 ease-out",
        isVisible ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
      )}
    >
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex flex-col items-center text-center transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        <LoaderVisual maskId={maskId} />
        <p className="mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.55em] text-muted-foreground">
          Harmonizing palette
        </p>
      </div>
    </div>
  );
}

function LoaderVisual({ maskId }: { maskId: string }) {
  return (
    <div className="theme-loader">
      <svg className="theme-loader__svg" width="100" height="100" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <mask id={maskId} className="theme-loader__mask">
            <rect width="100" height="100" fill="black" />
            <polygon points="25,25 75,25 50,75" fill="white" />
            <polygon points="50,25 75,75 25,75" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
            <polygon points="35,35 65,35 50,65" fill="white" />
          </mask>
        </defs>
      </svg>
      <div
        className="theme-loader__box"
        style={{
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      />
    </div>
  );
}

