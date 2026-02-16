'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { ShoppingCart, Menu } from 'lucide-react';

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.webp" 
              alt="HydroAir Technologies" 
              width={140} 
              height={45} 
              className="h-13 w-auto"
              priority
            />
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.products')}
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="md:hidden p-2 hover:bg-muted rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
