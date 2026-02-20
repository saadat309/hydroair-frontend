"use client";

import { useEffect, useRef } from "react";

function WavyBadge({
  text = "SALE",
  size = 60,
  bgColor = "hsl(var(--background))",
  textColor = "hsl(var(--primary))",
  strokeColor = "hsl(var(--primary))",
  strokeWidth = 2,
  waves = 14,
  amplitude = 4,
  fontSize = 12,
}) {
  const pathRef = useRef(null);
  const computedFontSize = fontSize ?? size * 0.16;

  useEffect(() => {
    if (!pathRef.current) return;
    const cx = size / 2;
    const cy = size / 2;
    const baseR = size / 2 - size * 0.11;
    const points = 720;
    let d = "";
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const r = baseR + amplitude * (size / 200) * Math.sin(waves * angle);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      d += (i === 0 ? "M" : "L") + `${x.toFixed(3)},${y.toFixed(3)} `;
    }
    d += "Z";
    pathRef.current.setAttribute("d", d);
  }, [size, waves, amplitude]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ overflow: "visible" }}
    >
      <style>{`
        @keyframes wavy-badge-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <g
        style={{
          animation: "wavy-badge-spin 12s linear infinite",
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
      >
        <path
          ref={pathRef}
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </g>
      <text
        x={size / 2}
        y={size / 2 + computedFontSize * 0.38}
        textAnchor="middle"
        fontFamily="Dosis, sans-serif"
        fontSize={computedFontSize}
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
