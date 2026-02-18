"use client";

import { useTranslation } from "@/lib/i18n";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { FlaskConical, Droplets, Filter, ShieldCheck } from "lucide-react";

export default function BrandStory() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  
  useGSAP(() => {
    gsap.from(".story-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    });
  }, { scope: containerRef });

  const cards = [
    { icon: FlaskConical, label: "lab" },
    { icon: Droplets, label: "composition" },
    { icon: Filter, label: "filtration" },
    { icon: ShieldCheck, label: "quality" },
  ];

  return (
    <section ref={containerRef} className="relative py-24 bg-secondary/30 overflow-hidden">
        {/* Wave Background SVG */}
        <div className="absolute top-0 left-0 w-full h-auto text-background opacity-100 rotate-180 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 120C240 120 480 0 720 0C960 0 1200 120 1440 120V120H0V120Z" fill="currentColor"/>
            </svg>
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Since 2010</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                {t('homepage.story.title')}
            </h3>
            
            <div className="w-24 h-1 bg-primary rounded-full mb-8"></div>
            
            <p className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-16 leading-relaxed">
                {t('homepage.story.description')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                {cards.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="story-card flex flex-col items-center gap-4 group">
                            <div className="w-24 h-24 rounded-full bg-background shadow-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <Icon className="w-10 h-10" />
                            </div>
                            <span className="text-lg font-semibold text-foreground max-w-[150px]">
                                {t(`homepage.story.cards.${item.label}`)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
  );
}
