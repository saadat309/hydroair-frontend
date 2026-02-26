"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { toast } from "sonner";

export default function SiteFooter() {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPathWithLocale = (path) => `/${locale}${path === "/" ? "" : path}`;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      await fetchAPI("/subscription-lists", {
        method: "POST",
        body: JSON.stringify({ data: { email } }),
      });
      toast.success(t("footer.subscribeSuccess") || "Successfully subscribed!");
      setEmail("");
    } catch (error) {
      const errorMessage = error?.message?.toLowerCase() || "";
      if (errorMessage.includes("already") || errorMessage.includes("unique")) {
        toast.info(t("footer.alreadySubscribed") || "This email is already subscribed!");
      } else {
        toast.error(t("footer.subscribeError") || "Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-foreground text-background mt-20">
      {/* Wave Footer Decoration - Top */}
      <div className="absolute -top-20 left-0 w-full h-[120px] text-foreground pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,96L30,80C60,64,120,32,180,53.3C240,75,300,149,360,154.7C420,160,480,96,540,96C600,96,660,160,720,192C780,224,840,224,900,202.7C960,181,1020,139,1080,101.3C1140,64,1200,32,1260,37.3C1320,43,1380,85,1410,106.7L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 pb-12">
        {/* Column 1: Menu */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-6 text-background flex items-center">
            <span className="inline-block w-[3px] h-6 bg-primary mr-2 rounded-full" />
            {t("footer.menu")}
          </h3>
          <ul className="space-y-4">
            <li>
              <Link href={getPathWithLocale("/")} className="hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link
                href={getPathWithLocale("/products")}
                className="hover:text-primary transition-colors"
              >
                {t("nav.products")}
              </Link>
            </li>
            <li>
              <Link
                href={getPathWithLocale("/about")}
                className="hover:text-primary transition-colors"
              >
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link
                href={getPathWithLocale("/contact")}
                className="hover:text-primary transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </li>
            <li>
              <Link
                href={getPathWithLocale("/orders")}
                className="hover:text-primary transition-colors"
              >
                {t("orders.title")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Contact */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-6 text-background flex items-center">
            <span className="inline-block w-[3px] h-6 bg-primary mr-2 rounded-full" />
            {t("footer.contact")}
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
              <span>{t("contact.info.officeAddress")}</span>
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
            <a
              href="#"
              className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 bg-background/10 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Column 3: Newsletter */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-6 text-background flex items-center">
            <span className="inline-block w-[3px] h-6 bg-primary mr-2 rounded-full" />
            {t("footer.subscribe")}
          </h3>
          <p className="mb-4 text-background/70">
            Stay updated with our latest filtration technology and offers.
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.subscribePlaceholder")}
              className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 focus:outline-none focus:border-primary text-background placeholder:text-background/50"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {t("footer.subscribeBtn")}
            </button>
          </form>
        </div>
      </div>

      <div className="container mt-16 pt-8 border-t border-background/10 text-center text-sm text-background/50">
        <p>{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
