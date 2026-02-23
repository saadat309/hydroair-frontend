"use client";

import { useEffect, useRef, useState } from "react";

function WavyBadge({
  text = "SALE",
  size = 80,                              // always fixed — badge never grows
  bgColor = "hsl(var(--background))",
  textColor = "hsl(var(--primary))",
  strokeColor = "hsl(var(--primary))",
  strokeWidth = 2,
  waves = 14,
  amplitude = 4,
  maxFontSize,                            // optional cap; defaults to size * 0.28
  minFontSize,                            // optional floor; defaults to size * 0.10
}) {
  const pathRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(null);

  const MAX_FONT = maxFontSize ?? size * 0.28;
  const MIN_FONT = minFontSize ?? size * 0.10;

  // Usable chord width inside the circle (with comfortable padding)
  const innerR = size / 2 - size * 0.11;
  const maxTextWidth = innerR * 1.35;

  // ── Build wavy path ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pathRef.current) return;
    const cx = size / 2;
    const cy = size / 2;
    const points = 720;
    let d = "";
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const r = innerR + amplitude * (size / 200) * Math.sin(waves * angle);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      d += (i === 0 ? "M" : "L") + `${x.toFixed(3)},${y.toFixed(3)} `;
    }
    d += "Z";
    pathRef.current.setAttribute("d", d);
  }, [size, waves, amplitude, innerR]);

  // ── Auto-fit font size via getBBox ─────────────────────────────────────────
  // Starts at MAX_FONT, measures real rendered width (works for any script),
  // then shrinks in 0.5px steps until the text fits inside maxTextWidth.
  useEffect(() => {
    if (!textRef.current) return;

    let fs = MAX_FONT;
    textRef.current.setAttribute("font-size", fs);

    let bbox = textRef.current.getBBox();
    while (bbox.width > maxTextWidth && fs > MIN_FONT) {
      fs = Math.max(MIN_FONT, fs - 0.5);
      textRef.current.setAttribute("font-size", fs);
      bbox = textRef.current.getBBox();
    }

    setFontSize(fs);
  }, [text, size, MAX_FONT, MIN_FONT, maxTextWidth]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ overflow: "visible" }}
    >
      <defs>
        <style>{`
          @keyframes wavy-badge-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </defs>

      {/* Spinning wavy border */}
      <g style={{
        animation: "wavy-badge-spin 12s linear infinite",
        transformOrigin: `${size / 2}px ${size / 2}px`,
      }}>
        <path
          ref={pathRef}
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </g>

      {/* Static text — font-size measured & clamped via getBBox */}
      <text
        ref={textRef}
        x={size / 2}
        y={size / 2 + (fontSize ?? MAX_FONT) * 0.35}
        textAnchor="middle"
        fontFamily="Dosis, sans-serif"
        fontSize={fontSize ?? MAX_FONT}
        fontWeight="bold"
        fill={textColor}
        letterSpacing={size * 0.008}
      >
        {text}
      </text>
    </svg>
  );
}

export default WavyBadge;