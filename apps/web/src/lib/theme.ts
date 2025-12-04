export const THEME_STORAGE_KEY = "portfolio-theme";
export const LIGHT_MODE_CLASS = "light-mode";
export const DARK_MODE_CLASS = "dark-mode";
export const THEME_TRANSITION_CLASS = "theme-transition";
export const THEME_TRANSITION_START_EVENT = "theme-transition:start";
export const THEME_TRANSITION_END_EVENT = "theme-transition:end";
export const THEME_TRANSITION_OVERLAY_IN = 150;
export const THEME_TRANSITION_OVERLAY_HOLD = 50;
export const THEME_TRANSITION_OVERLAY_OUT = 250;
export const THEME_TRANSITION_DURATION =
  THEME_TRANSITION_OVERLAY_IN + THEME_TRANSITION_OVERLAY_HOLD + THEME_TRANSITION_OVERLAY_OUT;

type ThemeTransitionOptions = {
  force?: boolean;
  applyTheme?: () => void;
};

declare global {
  interface WindowEventMap {
    "theme-transition:start": CustomEvent<void>;
    "theme-transition:end": CustomEvent<void>;
  }
}

let overlayStateFrame: number | null = null;
let applyFrame: number | null = null;
let exitFrame: number | null = null;
let cleanupTimeout: number | null = null;

const prefersReducedMotion = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const cancelFrame = (frame: number | null) => {
  if (typeof window === "undefined" || frame === null) {
    return;
  }
  window.cancelAnimationFrame(frame);
};

const dispatchTransitionEvent = (type: typeof THEME_TRANSITION_START_EVENT | typeof THEME_TRANSITION_END_EVENT) => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(type));
};

const finalizeTransition = (root: HTMLElement) => {
  cancelFrame(overlayStateFrame);
  cancelFrame(applyFrame);
  cancelFrame(exitFrame);
  overlayStateFrame = null;
  applyFrame = null;
  exitFrame = null;
  if (cleanupTimeout !== null && typeof window !== "undefined") {
    window.clearTimeout(cleanupTimeout);
    cleanupTimeout = null;
  }
  root.removeAttribute("data-theme-transition");
  root.classList.remove(THEME_TRANSITION_CLASS);
  dispatchTransitionEvent(THEME_TRANSITION_END_EVENT);
};

export function startThemeTransition(arg?: boolean | ThemeTransitionOptions) {
  const options: ThemeTransitionOptions =
    typeof arg === "boolean"
      ? {
          force: arg,
        }
      : arg ?? {};

  if (typeof window === "undefined") {
    options.applyTheme?.();
    return;
  }

  const root = document.documentElement;

  cancelFrame(overlayStateFrame);
  cancelFrame(applyFrame);
  cancelFrame(exitFrame);
  if (cleanupTimeout !== null) {
    window.clearTimeout(cleanupTimeout);
    cleanupTimeout = null;
  }

  const shouldAnimate = !prefersReducedMotion();

  if (!shouldAnimate) {
    options.applyTheme?.();
    root.removeAttribute("data-theme-transition");
    root.classList.remove(THEME_TRANSITION_CLASS);
    return;
  }

  root.classList.add(THEME_TRANSITION_CLASS);
  root.dataset.themeTransition = "pre-enter";
  dispatchTransitionEvent(THEME_TRANSITION_START_EVENT);

  overlayStateFrame = window.requestAnimationFrame(() => {
    root.dataset.themeTransition = "enter";
    overlayStateFrame = window.requestAnimationFrame(() => {
      root.dataset.themeTransition = "visible";
    });
  });

  const applyThemeAfterOverlay = () => {
    const runThemeChange = () => {
      if (!options.applyTheme) {
        return;
      }
      const viewTransition = (document as Document & {
        startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
      }).startViewTransition;
      if (typeof viewTransition === "function") {
        try {
          viewTransition(() => options.applyTheme?.());
        } catch {
          options.applyTheme();
        }
      } else {
        options.applyTheme();
      }
    };

    runThemeChange();
    root.dataset.themeTransition = "exit";

    const exitStart = performance.now();
    const stepExit = (timestamp: number) => {
      if (timestamp - exitStart >= THEME_TRANSITION_OVERLAY_OUT) {
        finalizeTransition(root);
        return;
      }
      exitFrame = window.requestAnimationFrame(stepExit);
    };
    exitFrame = window.requestAnimationFrame(stepExit);

    cleanupTimeout = window.setTimeout(() => finalizeTransition(root), THEME_TRANSITION_DURATION + 200);
  };

  const overlayDelay = THEME_TRANSITION_OVERLAY_IN + THEME_TRANSITION_OVERLAY_HOLD;
  const applyStart = performance.now();
  const stepApply = (timestamp: number) => {
    if (timestamp - applyStart >= overlayDelay) {
      applyFrame = null;
      applyThemeAfterOverlay();
      return;
    }
    applyFrame = window.requestAnimationFrame(stepApply);
  };
  applyFrame = window.requestAnimationFrame(stepApply);
}

