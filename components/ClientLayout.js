"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";
import Lenis from 'lenis';

export default function ClientLayout({ children, initialLocale }) {
  const { language: locale, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Sync store with server-side locale on mount
  useEffect(() => {
    if (initialLocale && locale !== initialLocale) {
      setLanguage(initialLocale);
    }
  }, [initialLocale, locale, setLanguage]);

  // Update HTML tag attributes when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Initialize Lenis and set mounted state
  useEffect(() => {
    setMounted(true);
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-[1440px] mx-auto bg-background shadow-xl ring-1 ring-border relative">
      <Navbar />
      <main className="flex-grow selection:bg-primary/20">
        {children}
      </main>
      {mounted && <ChatbotWidget />}
      <SiteFooter />
    </div>
  );
}
