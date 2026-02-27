"use client";

import { useTranslation } from "@/lib/i18n";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function FiltrationTechnology() {
    const { t } = useTranslation();
    const containerRef = useRef(null);
  
    const titleVariants = {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
    };
  
    const containerItemVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };
  
    const itemLeftVariants = {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.8 } },
    };
  
    const itemRightVariants = {
      hidden: { x: 50, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.8 } },
    };
  
    const items = t('homepage.filtration.items', { returnObjects: true });
    const leftItems = items.slice(0, 3);
    const rightItems = items.slice(3, 6);
  
    const dropPath = "M3,10.333 C3,13.463 5.427,16 8.418,16 C11.41,16 14,13.463 14,10.333 C14,7.204 8.418,0 8.418,0 C8.418,0 3,7.204 3,10.333 Z";
  
    return (
      <section
        ref={containerRef}
        className="py-16 md:py-24 relative bg-background "
      >
        {/* Swirl Arrow SVG */}
        <div className="absolute top-0 left-1/2 md:left-auto md:right-30 -translate-x-1/2 md:-translate-x-1/2 -mt-35 md:-mt-80 w-24 md:w-80 text-secondary rotate-20 md:rotate-50 z-0 opacity-80 md:opacity-100 pointer-events-none">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 150 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <path
              d="M 80 10 C 110 10, 120 40, 90 60
                 S 30 100, 60 120
                 S 120 160, 90 180
                 S 30 220, 60 240
                 S 115 300, 105 320"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="16 14"
            />
            <path
              d="M 105 320 L 90 305 M 105 320 L 120 305"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              {t("homepage.filtration.title")}
            </h2>
            <span className="text-xs md:text-sm font-bold tracking-widest text-primary uppercase mt-4 block">
              {t("homepage.filtration.subtitle")}
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
            {/* Left Column */}
            <motion.div
              className="flex-1 flex flex-col gap-16 md:gap-24 order-2 lg:order-1 lg:pr-12 w-full"
              variants={containerItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {leftItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative flex flex-col items-center lg:items-end text-center lg:text-left"
                  variants={itemLeftVariants}
                >
                  {/* Droplet BG */}
                  <div className="absolute top-1/2 left-1/2 lg:left-auto lg:right-0 -translate-x-1/2 lg:translate-x-1/3 -translate-y-1/2 w-20 h-20 md:w-36 md:h-36 pointer-events-none text-secondary -z-10 opacity-70">
                    <svg
                      viewBox="0 -0.5 17 17"
                      className="w-full h-full"
                      fill="currentColor"
                    >
                      <path d={dropPath} />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-2 md:mb-3">
                    {item.label}
                  </h3>
                  <p className="text-foreground max-w-[250px] lg:max-w-[200px] text-sm leading-relaxed lg:text-right">
                    <span className="hidden lg:inline-block w-[3px] h-3.5 bg-primary mr-1 translate-y-[2px] rounded-full" />
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Center Column: Bottle Image */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full lg:w-1/3 h-[300px] md:h-[400px] relative order-1 lg:order-2 flex items-center justify-center z-10"
            >
              <img
                src="/photos/bottle.webp"
                alt="Filtration Bottle"
                className="h-full w-auto object-contain drop-shadow-2xl animate-in zoom-in duration-1000"
              />
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="flex-1 flex flex-col gap-16 md:gap-24 order-3 lg:pl-12 w-full"
              variants={containerItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {rightItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative flex flex-col items-center lg:items-start text-center lg:text-left"
                  variants={itemRightVariants}
                >
                  {/* Droplet BG */}
                  <div className="absolute top-1/2 left-1/2 lg:left-0 -translate-x-1/2 lg:-translate-x-1/3 -translate-y-1/2 w-20 h-20 md:w-36 md:h-36 pointer-events-none text-secondary -z-10 opacity-70">
                    <svg
                      viewBox="0 -0.5 17 17"
                      className="w-full h-full"
                      fill="currentColor"
                    >
                      <path d={dropPath} />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-2 md:mb-3">
                    {item.label}
                  </h3>
                  <p className="text-foreground max-w-[250px] lg:max-w-[200px] text-sm leading-relaxed text-center lg:text-left">
                    <span className="hidden lg:inline-block w-[3px] h-3.5 bg-primary mr-1 translate-y-[2px] rounded-full" />
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
