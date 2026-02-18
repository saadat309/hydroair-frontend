"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-foreground text-background pt-32 pb-12 mt-auto">
      {/* Wave Footer Decoration */}
      <div className="absolute top-0 left-0 w-full h-auto text-background pointer-events-none">
         <svg className="w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50C240 100 480 0 720 0C960 0 1200 100 1440 50V100H0V50Z" fill="currentColor"/>
            <path d="M0 60C240 110 480 10 720 10C960 10 1200 110 1440 60V100H0V60Z" fill="currentColor" opacity="0.1"/>
        </svg>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        
        {/* Column 1: Menu */}
        <div>
            <h3 className="text-2xl font-bold font-heading mb-6 text-primary">{t('footer.menu')}</h3>
            <ul className="space-y-4">
                <li><Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">{t('nav.products')}</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">{t('nav.about')}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            </ul>
        </div>

        {/* Column 2: Contact */}
        <div>
            <h3 className="text-2xl font-bold font-heading mb-6 text-primary">{t('footer.contact')}</h3>
            <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>{t('contact.info.officeAddress')}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <span>+998 90 123 45 67</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <span>info@hydroair_tech.uz</span>
                </li>
            </ul>
            <div className="flex gap-4 mt-8">
                <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
        </div>

        {/* Column 3: Newsletter */}
        <div>
            <h3 className="text-2xl font-bold font-heading mb-6 text-primary">{t('footer.subscribe')}</h3>
            <p className="mb-4 text-background/70">Stay updated with our latest filtration technology and offers.</p>
            <form className="flex flex-col gap-3">
                <input 
                    type="email" 
                    placeholder={t('footer.subscribePlaceholder')} 
                    className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 focus:outline-none focus:border-primary text-background placeholder:text-background/50"
                />
                <button type="button" className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    {t('footer.subscribeBtn')}
                </button>
            </form>
        </div>

      </div>

      <div className="container mt-16 pt-8 border-t border-background/10 text-center text-sm text-background/50">
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  );
}
