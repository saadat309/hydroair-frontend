"use client";

import React from "react";

export default function WavyTopBackground({ height = "25%" }) {
  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden"
      style={{ height: height, zIndex: 0 }}
    >
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "100%" }}
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Desktop: Prominent Waves */}
        <g transform="scale(1, -1) translate(0, -100)">
        <path
          className="hidden md:block"
          d="M0 30 C 45 45, 135 15, 180 30 S 315 45, 360 30 S 495 45, 540 30 S 675 45, 720 30 S 855 45, 900 30 S 1035 45, 1080 30 S 1215 45, 1260 30 S 1395 45, 1440 30 L 1440 100 L 0 100 Z"
          fill="rgba(var(--color-secondary-rgb), 1)"
        />
        </g>
        {/* Mobile: Subtle Waves */}
        <path
          className="md:hidden"
          d="M0 0 H 1440 V 90 C 1395 85, 1305 95, 1260 90 S 1125 85, 1080 90 S 945 95, 900 90 S 765 85, 720 90 S 585 95, 540 90 S 405 85, 360 90 S 225 95, 180 90 S 90 85, 45 90 S 0 95, 0 90 Z"
          fill="rgba(var(--color-secondary-rgb), 1)"
        />
      </svg>
    </div>
  );
}