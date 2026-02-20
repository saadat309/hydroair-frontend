"use client";

import { useTranslation } from "@/lib/i18n";
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function HeroSection() {
    const { t } = useTranslation();
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
      <section ref={containerRef} className="relative w-full min-h-[130vh] flex flex-col items-center overflow-hidden">
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
  
        <div className="container relative z-10 flex flex-col lg:flex-row h-[120vh]">
  
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-3/5 h-screen flex flex-col justify-end lg:pl-20 pb-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-xl flex flex-col gap-4"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold leading-tight text-foreground uppercase tracking-normal"
              >
                  <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{t('homepage.hero.title')}</ReactMarkdown>
              </motion.h1>
  
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                  <p className="text-lg md:text-xl text-foreground leading-relaxed">
                      <span className="inline-block w-[3px] h-5 bg-primary mr-1 translate-y-[2px] rounded-full" />
                      {t('homepage.hero.subtitle')}
                  </p>
              </motion.div>
  
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
                  <Link
                      href="/products"
                      className="px-10 py-2 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all"
                  >
                      {t('homepage.hero.ctaPrimary')}
                  </Link>
  
                  <Link
                      href="/about"
                      className="px-10 py-2 bg-background text-foreground border border-border rounded-full text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all"
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
                          className="w-full lg:w-2/5 h-screen relative flex items-center justify-start p-8 lg:p-15 z-10"
                      >
                          <img
                              src="/photos/glass.png"
                              alt="Pure Water Glass"
                              className="max-w-full max-h-[98%] object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
                          />
                      </motion.div>
                  
      </div>
    </section>
  );
}


