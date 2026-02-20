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
    <section className="py-24 bg-background relative z-10 overflow-hidden">
      {/* Wave Background SVG */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: "800px", zIndex: -1 }}
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(var(--color-secondary-rgb),1)" />
            <stop offset="70%" stopColor="rgba(var(--color-secondary-rgb),1)" />
            <stop
              offset="100%"
              stopColor="rgba(var(--color-secondary-rgb),0)"
            />
          </linearGradient>
        </defs>
        <path
          d="M0 30 C 45 60, 135 0, 180 30 S 315 60, 360 30 S 495 60, 540 30 S 675 60, 720 30 S 855 60, 900 30 S 1035 60, 1080 30 S 1215 60, 1260 30 S 1395 60, 1440 30 L 1440 800 L 0 800 Z"
          fill="url(#waveFade)"
        />
      </svg>

      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background text-foreground text-sm font-semibold mb-4">
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            {t("homepage.faq.title")}
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full py-12 px-24 bg-background mx-auto shadow-[0_0_60px_rgba(var(--color-primary-rgb),0.3)] rounded-2xl"
        >
          {Array.isArray(items) &&
            items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold text-left flex items-center justify-start gap-x-0">
                  <span className="inline-block w-[3px] h-5 bg-primary mr-2 translate-y-[2px] rounded-full" />
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </section>
  );
}
