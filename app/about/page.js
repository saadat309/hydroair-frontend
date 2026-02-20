'use client';

import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Users, Droplets } from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { icon: <Droplets className="w-8 h-8 text-primary" />, value: "10M+", label: t('about.stats.liters') },
    { icon: <Users className="w-8 h-8 text-primary" />, value: "50k+", label: t('about.stats.customers') },
    { icon: <Award className="w-8 h-8 text-primary" />, value: "15+", label: t('about.stats.experience') },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-3xl rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('about.title')}</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              {t('about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border rounded-3xl p-8 text-center flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-foreground font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4">
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
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-teal-500/20" />
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000" 
                alt="Technology"
                className="w-full h-full object-cover mix-blend-overlay"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
