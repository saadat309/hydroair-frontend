"use client";

import { useTranslation } from "@/lib/i18n";
import { useRef } from "react";
import { FlaskConical, Droplets, Filter, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BrandStory() {
    const { t } = useTranslation();
    const containerRef = useRef(null);
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };
  
    const itemVariants = {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
    };
  
    const cards = [
      { icon: FlaskConical, label: "lab", colorClass: "text-chart-1" },
      { icon: Droplets, label: "composition", colorClass: "text-chart-2" },
      { icon: Filter, label: "filtration", colorClass: "text-chart-3" },
      { icon: ShieldCheck, label: "quality", colorClass: "text-chart-4" },
    ];
  
    return (
      <section ref={containerRef} className="relative m-4 p-24 shadow-[0_0_60px_rgba(var(--color-primary-rgb),0.3)] rounded-2xl overflow-hidden">
  
          <div className="container relative z-10 flex flex-col items-center text-center">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Since 2010</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                  {t('homepage.story.title')}
              </h3>
  
              <svg className="w-48 h-6 text-primary mb-8" viewBox="0 0 192 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 6 Q 8 2, 16 6 Q 24 10, 32 6 Q 40 2, 48 6 Q 56 10, 64 6 Q 72 2, 80 6 Q 88 10, 96 6 Q 104 2, 112 6 Q 120 10, 128 6 Q 136 2, 144 6 Q 152 10, 160 6 Q 168 2, 176 6 Q 184 10, 192 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
  
              <p className="max-w-3xl text-lg md:text-xl text-foreground mb-16 leading-relaxed">
                  {t('homepage.story.description')}
              </p>
  
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                  {cards.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          className="flex flex-col items-center gap-4 group"
                          variants={itemVariants}
                        >
                          <div className="w-36 h-36 rounded-full bg-background shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)] flex items-center justify-center group-hover:bg-primary/70 group-hover:text-primary-foreground group-hover:shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.5)] transition-colors duration-300">
                            <Icon className="w-18 h-18" strokeWidth={0.7} style={{ color: `hsl(var(--${item.colorClass.substring(5)}))` }} />
                          </div>
                          <span className="text-lg font-semibold text-foreground max-w-[150px] text-center">
                            {t(`homepage.story.cards.${item.label}`)}
                          </span>
                        </motion.div>
                      );
                  })}
              </motion.div>
          </div>
      </section>
    );
  }
