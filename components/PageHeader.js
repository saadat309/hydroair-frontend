'use client';

import WavyTopBackground from './WavyTopBackground';
import { cn } from '@/lib/utils';

export default function PageHeader({ title, subtitle, isProductsPage = false, children }) {
  return (
    <div className={cn(
      "relative overflow-hidden w-full mb-8 md:mb-12",
      isProductsPage 
        ? "h-[50vh] min-h-[400px]" 
        : "h-[40vh] md:h-[50vh] min-h-[320px] md:min-h-[400px]"
    )}>
      {/* Wavy Background - fixed height to cover the header area */}
      <div className="absolute inset-0 w-full h-full">
        <WavyTopBackground height="100%" />
      </div>
      
      {/* Top Section with Title - centered vertically, balanced padding to keep center at 50% height */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-[80px] pb-[20px] md:pb-[80px]">
        <div className="container text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-2 text-foreground">
            {title}
          </h1>

          <svg
            className="w-48 md:w-56 h-4 md:h-6 text-primary mt-3 mb-2 mx-auto"
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
          
          {subtitle && (
            <p className="text-base md:text-lg lg:text-xl text-foreground/80 font-medium max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              {subtitle}
            </p>
          )}

          {children && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
