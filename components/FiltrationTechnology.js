"use client";

import { useTranslation } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function FiltrationTechnology() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // Animate the title
    gsap.from(".tech-title", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8
    });

    // Animate list items coming in from sides
    gsap.from(".tech-item-left", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1
    });

    gsap.from(".tech-item-right", {
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });

  }, { scope: containerRef });

  const items = t('homepage.filtration.items', { returnObjects: true });
  const leftItems = items.slice(0, 3);
  const rightItems = items.slice(3, 6);

  return (
    <section ref={containerRef} className="py-24 bg-secondary/20 relative overflow-hidden">
        {/* Droplets SVG Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 text-primary">
            <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M200 0C200 0 100 150 100 250C100 332.843 144.772 400 200 400C255.228 400 300 332.843 300 250C300 150 200 0 200 0Z" fill="currentColor"/>
                <path d="M50 100C50 100 0 200 0 250C0 291.421 22.3858 325 50 325C77.6142 325 100 291.421 100 250C100 200 50 100 50 100Z" fill="currentColor" opacity="0.5"/>
                <path d="M350 100C350 100 300 200 300 250C300 291.421 322.386 325 350 325C377.614 325 400 291.421 400 250C400 200 350 100 350 100Z" fill="currentColor" opacity="0.5"/>
            </svg>
        </div>

        <div className="container relative z-10">
            <div className="text-center mb-16 tech-title">
                <span className="text-sm font-bold tracking-widest text-primary uppercase mb-2 block">
                    {t('homepage.filtration.subtitle')}
                </span>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                    {t('homepage.filtration.title')}
                </h2>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-12 order-2 lg:order-1">
                    {leftItems.map((item, idx) => (
                        <div key={idx} className="tech-item-left flex flex-col items-center lg:items-end text-center lg:text-right gap-2">
                             <h3 className="text-xl font-bold text-primary">{item.label}</h3>
                             <p className="text-muted-foreground max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
                
                {/* Center Column: Bottle Image */}
                <div className="w-full lg:w-1/3 h-[600px] relative order-1 lg:order-2 flex items-center justify-center drop-shadow-2xl">
                    <img 
                        src="/photos/bottle.png" 
                        alt="Filtration Bottle" 
                        className="h-full w-auto object-contain animate-in zoom-in duration-1000"
                    />
                </div>
                
                {/* Right Column */}
                <div className="flex-1 flex flex-col gap-12 order-3">
                     {rightItems.map((item, idx) => (
                        <div key={idx} className="tech-item-right flex flex-col items-center lg:items-start text-center lg:text-left gap-2">
                             <h3 className="text-xl font-bold text-primary">{item.label}</h3>
                             <p className="text-muted-foreground max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </section>
  );
}
