"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";
import {
  createNeuralBackground,
  type NeuralBackgroundController,
} from "@/lib/inspira/neural-background";

type NeuralBgProps = {
  hue?: number;
  saturation?: number;
  chroma?: number;
  animationSpeed?: number;
  colorShift?: number;
  className?: string;
};

type Palette = Required<Omit<NeuralBgProps, "className">>;

const lightPalette: Palette = {
  hue: 207,
  saturation: 0.46,
  chroma: 0.48,
  animationSpeed: 0.00022,
  colorShift: 0.02,
};

const darkPalette: Palette = {
  hue: 212,
  saturation: 0.78,
  chroma: 0.6,
  animationSpeed: 0.0003,
  colorShift: 0.08,
};

export function NeuralBg({
  hue,
  saturation,
  chroma,
  animationSpeed,
  colorShift,
  className,
}: NeuralBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<NeuralBackgroundController | null>(null);
  const { resolvedTheme } = useTheme();

  const palette = useMemo(() => (resolvedTheme === "dark" ? darkPalette : lightPalette), [resolvedTheme]);
  const toneClass =
    resolvedTheme === "dark"
      ? "opacity-95"
      : "opacity-65 mix-blend-screen saturate-125 brightness-110";
  const appliedHue = hue ?? palette.hue;
  const appliedSaturation = saturation ?? palette.saturation;
  const appliedChroma = chroma ?? palette.chroma;
  const appliedAnimationSpeed = animationSpeed ?? palette.animationSpeed;
  const appliedColorShift = colorShift ?? palette.colorShift;

  useEffect(() => {
    controllerRef.current = createNeuralBackground(canvasRef.current, {
      hue: appliedHue,
      saturation: appliedSaturation,
      chroma: appliedChroma,
      animationSpeed: appliedAnimationSpeed,
      colorShift: appliedColorShift,
    });

    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setHue(appliedHue);
  }, [appliedHue]);

  useEffect(() => {
    controllerRef.current?.setSaturation(appliedSaturation);
  }, [appliedSaturation]);

  useEffect(() => {
    controllerRef.current?.setChroma(appliedChroma);
  }, [appliedChroma]);

  useEffect(() => {
    controllerRef.current?.setAnimationSpeed(appliedAnimationSpeed);
  }, [appliedAnimationSpeed]);

  useEffect(() => {
    controllerRef.current?.setColorShift(appliedColorShift);
  }, [appliedColorShift]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "fixed inset-0 -z-10 h-full w-full pointer-events-none",
        toneClass,
        className,
      )}
    />
  );
}

