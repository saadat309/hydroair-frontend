"use client";

import { useTranslation } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // Initial entrance for text (runs once on mount)
    gsap.from(textRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-[120vh] flex flex-col items-center bg-white overflow-hidden">
      {/* Background Pattern - Balanced Diagonal Wave Structure */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="absolute inset-0 w-full h-full text-[#f0f8ff]" viewBox="0 0 1440 1024" fill="none" preserveAspectRatio="none">
          <path 
            d="M 0 1024 
               L 0 550 
               C 150 450, 250 450, 450 300 
               C 650 150, 600 50, 750 0 
               L 1440 0 
               L 1440 474 
               C 1290 574, 1190 574, 990 724 
               C 790 874, 840 974, 690 1024 
               Z" 
            fill="currentColor" 
          />
        </svg>
      </div>

      <div className="container relative z-10 flex flex-col lg:flex-row h-[120vh]">
        
        {/* Left Column: Text Content */}
        <div className="w-full lg:w-1/2 h-screen flex flex-col justify-end lg:pl-50 pb-20">
          <div ref={textRef} className="max-w-xl flex flex-col gap-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-[1] text-[#0a1d37] uppercase tracking-tighter">
                {t('homepage.hero.title')}
            </h1>
            
            <div className="flex items-start gap-4">
                <div className="w-1 h-8 bg-[#3b82f6] mt-2 shrink-0" />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {t('homepage.hero.subtitle')}
                </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
                <Link 
                    href="/products" 
                    className="px-10 py-2 bg-[#3b82f6] text-white rounded-full text-lg font-bold hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-1"
                >
                    {t('homepage.hero.ctaPrimary')}
                </Link>
                
                <Link 
                    href="/about" 
                    className="px-10 py-2 bg-white text-foreground border border-border rounded-full text-lg font-bold hover:bg-muted transition-all"
                >
                    {t('homepage.hero.ctaSecondary')}
                </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Static Glass Image */}
         <div className="w-full lg:w-1/2 h-screen relative flex items-center justify-center p-10 lg:p-20">
            <img 
                src="/photos/glass.png" 
                alt="Pure Water Glass" 
                className="max-w-full max-h-[98%] object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
            />
        </div>

      </div>
    </section>
  );
}


