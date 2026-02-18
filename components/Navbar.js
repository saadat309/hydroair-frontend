"use client";

import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { ShoppingCart, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import useCartStore from "@/lib/stores/useCartStore";
import CartDrawer from "./CartDrawer";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { totalItems } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
                src="/logo.webp" 
                alt="HydroAir Technologies" 
                width={150} 
                height={40} 
                className="h-10 w-auto object-contain"
                priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/products"
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              {t("nav.products")}
            </Link>
            <Link
              href="/about"
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="text-foreground/80 hover:text-primary font-medium transition-colors"
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="flex items-center gap-4">
             {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium border-r border-border pr-4">
              {['en', 'ru', 'uz'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`uppercase transition-colors ${
                    language === lang ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button className="text-foreground/80 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <CartDrawer>
                <button className="relative text-foreground/80 hover:text-primary transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
                            {totalItems}
                        </span>
                    )}
                </button>
            </CartDrawer>
            
            <button 
                className="md:hidden text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-6 text-xl font-heading font-bold">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>{t("nav.home")}</Link>
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>{t("nav.products")}</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>{t("nav.about")}</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t("nav.contact")}</Link>
            </div>
             <div className="mt-8 flex gap-4">
              {['en', 'ru', 'uz'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setIsMobileMenuOpen(false); }}
                  className={`uppercase px-4 py-2 border rounded-full ${
                    language === lang ? "bg-primary text-primary-foreground border-primary" : "border-border"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
        </div>
      )}
    </>
  );
}
