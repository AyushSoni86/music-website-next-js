"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import Image from "next/image";
import data from "../data/why_choose_us.json";
const content = data;

export function WhyChooseUs() {
  return (
    <div>
      <StickyScroll content={data} />
    </div>
  );
}
