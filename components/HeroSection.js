"use client";

import { useTranslation } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import ScrollVideo from "./ScrollVideo";

export default function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(textRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      delay: 0.2
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-[150vh] flex flex-col items-center bg-background overflow-hidden">
      {/* Background SVG - Organic Blob */}
      <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none z-0 opacity-10 text-primary">
         <svg className="w-full h-full" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1440 0C1440 0 869.5 0 869.5 350.5C869.5 701 1440 960 1440 960V0Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="container relative z-10 flex flex-col lg:flex-row items-center h-screen pt-20">
        
        {/* Left Column: Text Content */}
        <div ref={textRef} className="w-full lg:w-1/2 flex flex-col justify-center gap-6 px-4 lg:pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-primary text-sm font-semibold w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                New Filtration Tech
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-foreground">
                {t('homepage.hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-lg">
                {t('homepage.hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
                <Link 
                    href="/products" 
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    {t('homepage.hero.ctaPrimary')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full text-lg font-semibold hover:bg-secondary/80 transition-all">
                    <Play className="w-5 h-5 fill-current" />
                    {t('homepage.hero.ctaSecondary')}
                </button>
            </div>

            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-border/50">
                <div>
                    <p className="text-3xl font-bold text-primary">50k+</p>
                    <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-primary">15+</p>
                    <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
            </div>
        </div>

        {/* Right Column: Scroll Video Canvas */}
        {/* The canvas container needs to stay fixed or sticky while we scroll through the section height */}
         <div className="w-full lg:w-1/2 h-[50vh] lg:h-[80vh] relative mt-10 lg:mt-0">
            <div className="sticky top-20 w-full h-full">
                <ScrollVideo 
                    folderPath="/videos/water-glass-1" 
                    frameCount={122} 
                    triggerRef={containerRef}
                />
            </div>
        </div>

      </div>
    </section>
  );
}
