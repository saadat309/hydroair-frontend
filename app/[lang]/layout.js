import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { fetchAPI } from "@/lib/api";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { TranslationProvider } from "@/lib/i18n/TranslationProvider";
import MaintenancePage from "@/components/MaintenancePage";
import { Suspense } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hydroairtechnologies.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HydroAir Technologies",
  "url": siteUrl,
  "logo": `${siteUrl}/logo.png`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+998901234567",
    "contactType": "customer service",
    "email": "support@hydroairtechnologies.com",
    "availableLanguage": ["English", "Russian", "Uzbek"]
  },
  "sameAs": [
    "https://facebook.com/hydroairtechnologies",
    "https://instagram.com/hydroairtechnologies",
    "https://twitter.com/hydroairtech"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HydroAir Technologies",
  "url": siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteUrl}/{search={search_term_stringlang}/products?}`
    },
    "query-input": "required name=search_term_string"
  }
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  
  return {
    title: "HydroAir Technologies | Clean Air & Water Solutions",
    description: "Innovative air and water filtration technologies for a healthier environment.",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        ru: "/ru",
        uz: "/uz",
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-96x96.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }, { lang: "uz" }];
}

async function MainContent({ children, lang }) {
  let isMaintenanceMode = false;
  let maintenanceData = null;
  try {
    const globalData = await fetchAPI("/global-setting", { locale: lang }, { cache: 'no-store' });
    isMaintenanceMode = globalData?.data?.Show_Maintenance_Message || false;
    maintenanceData = globalData?.data;
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
  }

  // Fetch dictionary on the server
  const dictionary = await getDictionary(lang);

  if (isMaintenanceMode) {
    return (
      <TranslationProvider dictionary={dictionary} locale={lang}>
        <MaintenancePage initialData={maintenanceData} />
      </TranslationProvider>
    );
  }

  return (
    <TranslationProvider dictionary={dictionary} locale={lang}>
      <ClientLayout initialLocale={lang}>
        {children}
        <Toaster />
      </ClientLayout>
    </TranslationProvider>
  );
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema]
  };

  return (
    <html lang={lang || "en"} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen font-body" suppressHydrationWarning={true}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <MainContent lang={lang}>
            {children}
          </MainContent>
        </Suspense>
      </body>
    </html>
  );
}
