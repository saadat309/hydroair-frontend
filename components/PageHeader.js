'use client';

import WavyTopBackground from './WavyTopBackground';

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="relative min-h-80 overflow-hidden pt-15">
      {/* Wavy Background */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "calc(50vh + 80px)" }}
      >
        <WavyTopBackground height="100%" />
      </div>
      
      {/* Top Section with Title */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(50vh - 80px)] pt-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
            {title}
          </h1>

          <svg
            className="w-56 h-6 text-primary mt-3 mb-6 mx-auto"
            viewBox="0 0 192 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 6 Q 8 2, 16 6 Q 24 10, 32 6 Q 40 2, 48 6 Q 56 10, 64 6 Q 72 2, 80 6 Q 88 10, 96 6 Q 104 2, 112 6 Q 120 10, 128 6 Q 136 2, 144 6 Q 152 10, 160 6 Q 168 2, 176 6 Q 184 10, 192 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
