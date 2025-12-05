 "use client";

import * as React from "react";
import {
  LightSpeedApp,
  defaultOptions,
  distortions,
  type LightSpeedPresetKey,
  lightSpeedPresets,
} from "@/lib/inspira/light-speed";

const presetLabels: Record<LightSpeedPresetKey, string> = {
  one: "Light 1",
  two: "Light 2",
  three: "Light 3",
  four: "Light 4",
  five: "Light 5",
  six: "Light 6",
};

export function HeroScene() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [preset, setPreset] = React.useState<LightSpeedPresetKey>("one");
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const container = containerRef.current;
    if (!container || typeof window === "undefined") {
      return;
    }

    const mergedOptions = {
      ...defaultOptions,
      ...lightSpeedPresets[preset],
    };

    if (typeof mergedOptions.distortion === "string") {
      mergedOptions.distortion =
        distortions[mergedOptions.distortion] ?? distortions.turbulentDistortion;
    }

    const app = new LightSpeedApp(container, mergedOptions);
    let disposed = false;

    app.loadAssets().then(() => {
      if (!disposed) {
        app.init();
      } else {
        app.destroy();
      }
    });

    return () => {
      disposed = true;
      app.destroy();
    };
  }, [preset, prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-4 font-heading">
      <div className="relative h-80 w-full overflow-hidden rounded-[1.7rem] border border-slate-200/70 bg-white/90 shadow-[0_35px_120px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-black/70 dark:shadow-[0_25px_90px_rgba(0,0,0,0.65)]">
        <div ref={containerRef} className="size-full" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-white/70">Click to speed up</p>
          {prefersReducedMotion && (
            <span className="text-sm text-slate-500 dark:text-white/60">Motion disabled to honor your settings.</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Preset
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value as LightSpeedPresetKey)}
            className="rounded-full border border-slate-300 bg-white/85 px-3 py-1 text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background dark:border-white/20 dark:bg-black/60 dark:text-white dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-0"
          >
            {Object.keys(lightSpeedPresets).map((key) => (
              <option key={key} value={key}>
                {presetLabels[key as LightSpeedPresetKey]}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Choose a distortion preset
        </p>
      </div>
    </div>
  );
}

