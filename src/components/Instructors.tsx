"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";
import people from "../data/people.json";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export function Instructors() {
  return (
    <div className="relative h-[40rem] overflow-hidden flex items-center justify-center">
      <WavyBackground className="w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">
          Meet Out Instructors
        </h2>
        <p className="text-base md:text-lg mb-4 text-white font-normal text-center">
          Discover the talented professionals who will guide your musical
          journey
        </p>
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={people} />
        </div>
      </WavyBackground>
    </div>
  );
}
