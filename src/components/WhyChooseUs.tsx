"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import data from "../data/why_choose_us.json";

export function WhyChooseUs() {
  return (
    <div>
      <StickyScroll content={data} />
    </div>
  );
}
