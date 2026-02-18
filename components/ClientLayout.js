"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";
import Lenis from 'lenis';

export default function ClientLayout({ children }) {
  const { locale, dir } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  // Update HTML tag attributes when locale or dir changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir, mounted]);

  // Prevent hydration mismatch by waiting for client-side mount
  useEffect(() => {
    setMounted(true);
    
    // Initialize Lenis smooth scroll
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

  if (!mounted) {
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow selection:bg-primary/20">
        {children}
      </main>
      <ChatbotWidget />
      <SiteFooter />
    </div>
  );
}
