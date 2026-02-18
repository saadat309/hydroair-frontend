"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-foreground text-background mt-20">
      {/* Wave Footer Decoration - Top */}
      <div className="absolute -top-20 left-0 w-full h-[120px] text-(--forground) pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#120d48"
            d="M0,96L34.3,106.7C68.6,117,137,139,206,144C274.3,149,343,139,411,149.3C480,160,549,192,617,176C685.7,160,754,96,823,96C891.4,96,960,160,1029,186.7C1097.1,213,1166,203,1234,165.3C1302.9,128,1371,64,1406,32L1440,0L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 pb-12">
        {/* Column 1: Menu */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-6 text-primary">
            {t("footer.menu")}
          </h3>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-primary transition-colors"
              >
                {t("nav.products")}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Contact */}
        <div>
          <h3 className="text-2xl font-bold font-heading mb-6 text-primary">
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
          <h3 className="text-2xl font-bold font-heading mb-6 text-primary">
            {t("footer.subscribe")}
          </h3>
          <p className="mb-4 text-background/70">
            Stay updated with our latest filtration technology and offers.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder={t("footer.subscribePlaceholder")}
              className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 focus:outline-none focus:border-primary text-background placeholder:text-background/50"
            />
            <button
              type="button"
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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
