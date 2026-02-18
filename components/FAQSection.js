"use client";

import { useTranslation } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const { t } = useTranslation();
  const items = t('homepage.faq.items', { returnObjects: true });

  return (
    <section className="py-24 bg-background relative z-10">
      {/* Subtle Wave Top Decoration */}
      <div className="absolute top-0 left-0 w-full h-auto text-secondary/30 pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60C360 60 480 0 720 0C960 0 1080 60 1440 60H0Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-primary text-sm font-semibold mb-4">
                <span>Home</span>
                <span>/</span>
                <span>FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                {t('homepage.faq.title')}
            </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
            {Array.isArray(items) && items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold text-left">
                        {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                        {item.a}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </section>
  );
}
