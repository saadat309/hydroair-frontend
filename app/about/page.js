'use client';

import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BrandStory from "@/components/BrandStory";
import StatsSection from "@/components/StatsSection";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col pb-20">
      {/* Page Header */}
      <PageHeader title={t('about.title')} />

      {/* Content Section */}
      <section className="container mx-auto px-4 mb-12 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">{t('about.mission.title')}</h2>
            <p className="text-lg text-foreground leading-relaxed">
              {t('about.mission.description')}
            </p>
            <div className="space-y-4 pt-4">
              {t('about.mission.items', { returnObjects: true })?.map?.((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-medium">{item}</span>
                </div>
              )) || [
                "Certified Medical-Grade Components",
                "24/7 Professional Support",
                "Advanced 7-Stage Filtration Technology",
                "Eco-Friendly Water Conservation"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden border">
              <img 
                src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1000" 
                alt="Water Filter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <BrandStory />

      {/* Stats Section */}
      <div className="-mt-8">
        <StatsSection />
      </div>
    </div>
  );
}
