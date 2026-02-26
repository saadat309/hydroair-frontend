"use client";

import { useTranslation } from "@/lib/i18n";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function HeroSection() {
    const { t, locale } = useTranslation();
    const containerRef = useRef(null);
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3,
        },
      },
    };
  
    const itemVariants = {
      hidden: { y: 30, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };
  
    const components = {
      strong: ({ node, ...props }) => <strong className="text-primary" {...props} />,
    };
  
    return (
      <section ref={containerRef} className="relative w-full min-h-[110vh] lg:min-h-[130vh] flex flex-col items-center overflow-hidden">
        {/* Background Pattern - Balanced Diagonal Wave Structure */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="absolute inset-0 w-full h-full text-secondary" viewBox="0 0 1440 1024" fill="none" preserveAspectRatio="none">
            <path
              d="M 0 1024
                 L 0 300
                 C 150 50, 350 100, 250 100
                 C 650 50, 600 50, 750 0
                 L 1440 0
                 L 1440 574
                 C 1290 874, 1190 674, 1124 724
                 C 990 974, 40 674, 0 1024
                 Z"
              fill="currentColor"
            />
          </svg>
        </div>
  
        <div className="container relative z-10 flex flex-col-reverse lg:flex-row min-h-screen pt-12 lg:pt-0">
  
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-3/5 flex flex-col justify-start lg:justify-end lg:pl-20 pb-12 lg:pb-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-xl flex flex-col gap-6"
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground uppercase tracking-normal"
              >
                  <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{t('homepage.hero.title')}</ReactMarkdown>
              </motion.h1>
  
              <motion.div variants={itemVariants} className="flex items-start gap-2">
                  <span className="inline-block w-[3px] h-6 bg-primary shrink-0 mt-1 rounded-full" />
                  <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed">
                      {t('homepage.hero.subtitle')}
                  </p>
              </motion.div>
  
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 md:gap-6 pt-4">
                  <Link
                      href={`/${locale}/products`}
                      className="flex-1 md:flex-none text-center px-6 md:px-10 py-3 bg-primary text-primary-foreground rounded-full text-base md:text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all"
                  >
                      {t('homepage.hero.ctaPrimary')}
                  </Link>
  
                  <Link
                      href={`/${locale}/about`}
                      className="flex-1 md:flex-none text-center px-6 md:px-10 py-3 bg-background text-foreground border border-border rounded-full text-base md:text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all"
                  >
                      {t('homepage.hero.ctaSecondary')}
                  </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Static Glass Image */}
          <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full lg:w-2/5 flex items-center justify-center p-4 md:p-8 lg:p-15 z-10 lg:h-screen pt-12 lg:pt-0"
          >
              <img
                  src="/photos/glass.png"
                  alt="Pure Water Glass"
                  className="w-auto h-auto max-w-[250px] md:max-w-[400px] lg:max-w-full max-h-[40vh] md:max-h-[50vh] lg:max-h-[98%] object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
              />
          </motion.div>
                  
      </div>
    </section>
  );
}


