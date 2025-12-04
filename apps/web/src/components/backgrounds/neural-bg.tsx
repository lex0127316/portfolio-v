"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import {
  createNeuralBackground,
  type NeuralBackgroundController,
} from "@/lib/inspira/neural-background";

type NeuralBgProps = {
  hue?: number;
  saturation?: number;
  chroma?: number;
  className?: string;
};

export function NeuralBg({
  hue = 200,
  saturation = 0.8,
  chroma = 0.6,
  className,
}: NeuralBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<NeuralBackgroundController | null>(null);

  useEffect(() => {
    controllerRef.current = createNeuralBackground(canvasRef.current, {
      hue,
      saturation,
      chroma,
    });

    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setHue(hue);
  }, [hue]);

  useEffect(() => {
    controllerRef.current?.setSaturation(saturation);
  }, [saturation]);

  useEffect(() => {
    controllerRef.current?.setChroma(chroma);
  }, [chroma]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "fixed inset-0 -z-10 h-full w-full pointer-events-none opacity-95",
        className,
      )}
    />
  );
}

