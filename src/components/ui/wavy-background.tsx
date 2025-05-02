"use client";
import { cn } from "@/utils/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";

type WavyBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
};

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState(false);
  const animationIdRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const wRef = useRef<number>(0);
  const hRef = useRef<number>(0);
  const ntRef = useRef<number>(0);

  const getSpeed = useCallback((): number => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  const drawWave = useCallback(
    (n: number) => {
      const waveColors = colors ?? [
        "#38bdf8",
        "#818cf8",
        "#c084fc",
        "#e879f9",
        "#22d3ee",
      ];
      const ctx = ctxRef.current;
      if (!ctx) return;
      ntRef.current += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < wRef.current; x += 5) {
          const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
          ctx.lineTo(x, y + hRef.current * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    },
    [getSpeed, noise, waveWidth, colors]
  );

  const render = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity;
    ctx.fillRect(0, 0, wRef.current, hRef.current);
    drawWave(5);
    animationIdRef.current = requestAnimationFrame(render);
  }, [drawWave, backgroundFill, waveOpacity]);

  // Memoizing the `init` function to prevent unnecessary re-renders
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    wRef.current = canvas.width = window.innerWidth;
    hRef.current = canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    ntRef.current = 0;

    window.onresize = () => {
      if (!ctxRef.current || !canvasRef.current) return;
      wRef.current = canvasRef.current.width = window.innerWidth;
      hRef.current = canvasRef.current.height = window.innerHeight;
      ctxRef.current.filter = `blur(${blur}px)`;
    };

    render();
  }, [blur, render]); // `blur` is the only dependency that can change the `init` function

  useEffect(() => {
    init();
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [init]); // Now `init` is memoized and used safely in the dependency array

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
