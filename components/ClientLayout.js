"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI } from "@/lib/api";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ChatbotWidget from "@/components/Chatbot/ChatbotWidget";
import MaintenancePage from "@/components/MaintenancePage";
import Lenis from 'lenis';

export default function ClientLayout({ children }) {
  const { language: locale, dir } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [checkedMaintenance, setCheckedMaintenance] = useState(false);

  // Check maintenance mode on mount
  useEffect(() => {
    async function checkMaintenance() {
      try {
        const data = await fetchAPI("/global-setting", {
          locale,
        });
        setIsMaintenanceMode(data?.data?.Show_Maintenance_Message || false);
      } catch (error) {
        console.error("Failed to fetch global setting:", error);
      } finally {
        setCheckedMaintenance(true);
      }
    }
    checkMaintenance();
  }, [locale]);

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

  if (!mounted || !checkedMaintenance) {
      return null;
  }

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-[1440px] mx-auto bg-background shadow-xl ring-1 ring-border relative">
      <Navbar />
      <main className="flex-grow selection:bg-primary/20">
        {children}
      </main>
      <ChatbotWidget />
      <SiteFooter />
    </div>
  );
}
