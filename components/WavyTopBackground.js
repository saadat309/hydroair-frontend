"use client";

import React from "react";

export default function WavyTopBackground({ height = "25%" }) {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: height, zIndex: 0 }}>
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "100%" }} // Adjusted to fill its parent div's height
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="topWaveFadeProducts" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(var(--color-secondary-rgb),1)" />
            <stop offset="100%" stopColor="rgba(var(--color-secondary-rgb),0)" />
          </linearGradient>
        </defs>
        <g transform="scale(1, -1) translate(0, -100)">
          <path
            d="M0 30 C 45 45, 135 15, 180 30 S 315 45, 360 30 S 495 45, 540 30 S 675 45, 720 30 S 855 45, 900 30 S 1035 45, 1080 30 S 1215 45, 1260 30 S 1395 45, 1440 30 L 1440 100 L 0 100 Z"
            fill="url(#topWaveFadeProducts)"
          />
        </g>
      </svg>
    </div>
  );
}