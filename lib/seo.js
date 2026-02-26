const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || "http://localhost:3000";

const supportedLocales = ["en", "ru", "uz"];

function getAlternateLanguages(path) {
  const languages = {};
  supportedLocales.forEach((locale) => {
    languages[locale] = `${frontendUrl}/${locale}${path}`;
  });
  return languages;
}

export function buildDictionarySEO(lang, pageKey, path) {
  return async () => {
    const { getDictionary } = await import("@/lib/i18n/get-dictionary");
    const dictionary = await getDictionary(lang);
    const seo = dictionary?.seo?.[pageKey];

    if (!seo) {
      return null;
    }

    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: `${frontendUrl}/${lang}${path}`,
        languages: getAlternateLanguages(path),
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: `${frontendUrl}/${lang}${path}`,
        siteName: "HydroAir Technologies",
        locale: lang,
        alternateLocale: supportedLocales.filter((l) => l !== lang),
        type: "website",
      },
    };
  };
}

export async function fetchStrapiSEO(endpoint, locale, slug) {
  try {
    const url = `${strapiUrl}/api/${endpoint}?locale=${locale}&filters[slug][$eq]=${slug}&populate=seo`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data.data?.[0]?.seo || null;
  } catch (e) {
    console.error(`Error fetching SEO from ${endpoint}:`, e);
    return null;
  }
}

export function buildStrapiSEO(seoData, lang, path, options = {}) {
  const {
    title: fallbackTitle,
    description: fallbackDescription,
    type = "website",
    image = null,
  } = options;

  const title = seoData?.page_title || fallbackTitle;
  const description = seoData?.page_description || fallbackDescription;

  const images = [];
  if (seoData?.og_image?.url) {
    images.push({ url: `${strapiUrl}${seoData.og_image.url}` });
  } else if (image) {
    images.push({ url: image });
  }

  return {
    title,
    description,
    keywords: seoData?.keywords,
    robots: seoData?.robots || "index, follow",
    alternates: {
      canonical: seoData?.canonical_url || `${frontendUrl}/${lang}${path}`,
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title,
      description,
      url: `${frontendUrl}/${lang}${path}`,
      siteName: "HydroAir Technologies",
      locale: lang,
      alternateLocale: supportedLocales.filter((l) => l !== lang),
      type,
      images,
    },
  };
}

export function buildPageSEO(lang, path, options = {}) {
  const {
    title: fallbackTitle,
    description: fallbackDescription,
    type = "website",
    image = null,
  } = options;

  return {
    title: fallbackTitle,
    description: fallbackDescription,
    alternates: {
      canonical: `${frontendUrl}/${lang}${path}`,
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: fallbackTitle,
      description: fallbackDescription,
      url: `${frontendUrl}/${lang}${path}`,
      siteName: "HydroAir Technologies",
      locale: lang,
      alternateLocale: supportedLocales.filter((l) => l !== lang),
      type,
      images: image ? [{ url: image }] : [],
    },
  };
}
