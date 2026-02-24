"use client";

import { useTranslation } from "@/lib/i18n";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Filter, Droplets } from "lucide-react"; // Example icons

// Helper component for animating numbers
function AnimatedNumber({ value, suffix = "", duration = 2000 }) {
  const [currentValue, setCurrentValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const increment = value / (duration / 16); // 16ms per frame
      let animationFrameId;

      const animateCount = () => {
        startValue += increment;
        if (startValue < value) {
          setCurrentValue(Math.round(startValue));
          animationFrameId = requestAnimationFrame(animateCount);
        } else {
          setCurrentValue(value);
        }
      };

      animationFrameId = requestAnimationFrame(animateCount);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [value, isInView, duration]);

  return <span ref={ref}>{currentValue}{suffix}</span>;
}

export default function StatsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  const stats = [
    { id: 1, value: 200, label: t("about.stats.filtersDelivered"), suffix: "+" },
    { id: 2, value: 5, label: t("about.stats.yearsExperience"), suffix: "+" },
    { id: 3, value: 99, label: t("about.stats.happyCustomers"), suffix: "%" },
  ];

  return (
    <section ref={sectionRef} className="bg-background relative z-10 overflow-hidden min-h-[60vh] md:min-h-[80vh] flex items-center justify-center my-16 md:my-36">
      {/* Top Wave SVG */}
      <svg
        className="absolute top-0 left-0 w-full h-[15%] md:h-[25%] pointer-events-none"
        style={{ zIndex: 0 }}
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="topWaveFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(var(--color-secondary-rgb),1)" />
            <stop offset="100%" stopColor="rgba(var(--color-secondary-rgb),0)" />
          </linearGradient>
        </defs>
        <g transform="scale(1, -1) translate(0, -100)">
          <path
            d="M0 30 C 45 60, 135 0, 180 30 S 315 60, 360 30 S 495 60, 540 30 S 675 60, 720 30 S 855 60, 900 30 S 1035 60, 1080 30 S 1215 60, 1260 30 S 1395 60, 1440 30 L 1440 100 L 0 100 Z"
            fill="url(#topWaveFade)"
          />
        </g>
      </svg>

      {/* Bottom Wave SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[15%] md:h-[25%] pointer-events-none"
        style={{ zIndex: 0 }}
        viewBox="0 0 1440 100"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bottomWaveFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(var(--color-secondary-rgb),1)" />
            <stop offset="100%" stopColor="rgba(var(--color-secondary-rgb),0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 30 C 45 60, 135 0, 180 30 S 315 60, 360 30 S 495 60, 540 30 S 675 60, 720 30 S 855 60, 900 30 S 1035 60, 1080 30 S 1215 60, 1260 30 S 1395 60, 1440 30 L 1440 100 L 0 100 Z"
          fill="url(#bottomWaveFade)"
        />
      </svg>

      {/* Floating Icons */}
      <motion.div
        className="absolute z-0 hidden md:block"
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "20%", left: "15%", rotate: "20deg" }}
      >
        <Filter className="w-16 h-16" style={{ color: `hsl(var(--chart-2))` }} />
      </motion.div>
      <motion.div
        className="absolute z-0 hidden md:block"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "20%", right: "10%", rotate: "-30deg" }}
      >
        <Droplets className="w-20 h-20" style={{ color: `hsl(var(--chart-4))` }} />
      </motion.div>

      <div className="container relative z-10 py-16 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center">
              <p className="text-5xl md:text-6xl font-bold font-heading text-primary mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-base md:text-lg text-foreground max-w-[200px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
