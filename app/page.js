'use client';

import Hero from "@/components/Hero";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />
      
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('nav.products')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Featured products placeholders */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-6">
                <div className="h-4 w-1/4 bg-muted mb-2 rounded" />
                <div className="h-6 w-3/4 bg-muted mb-4 rounded" />
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/4 bg-muted rounded" />
                  <div className="h-10 w-1/3 bg-primary/20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}