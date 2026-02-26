import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const tag = resolvedSearchParams?.tag;
  
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  
  let seoData;
  if (category) {
    try {
      const res = await fetch(`${strapiUrl}/api/categories?locale=${lang}&filters[slug][$eq]=${category}&populate=seo`);
      const data = await res.json();
      seoData = data.data?.[0]?.seo;
    } catch (e) {
      console.error("Error fetching category SEO:", e);
    }
  } else if (tag) {
    try {
      const res = await fetch(`${strapiUrl}/api/tags?locale=${lang}&filters[slug][$eq]=${tag}&populate=seo`);
      const data = await res.json();
      seoData = data.data?.[0]?.seo;
    } catch (e) {
      console.error("Error fetching tag SEO:", e);
    }
  }
  
  const title = seoData?.page_title || "All Products | HydroAir Technologies";
  const description = seoData?.page_description || "Explore our high-performance air and water filtration solutions.";
  
  const queryStr = category ? `?category=${category}` : tag ? `?tag=${tag}` : "";
  const canonical = `${frontendUrl}/${lang}/products${queryStr}`;

  return {
    title,
    description,
    keywords: seoData?.keywords,
    alternates: {
      canonical,
      languages: {
        en: `${frontendUrl}/en/products${queryStr}`,
        ru: `${frontendUrl}/ru/products${queryStr}`,
        uz: `${frontendUrl}/uz/products${queryStr}`,
      },
    },
    robots: seoData?.robots || "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "HydroAir Technologies",
      images: seoData?.og_image ? [{ url: `${strapiUrl}${seoData.og_image.url}` }] : [],
      type: "website",
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductsClient />
    </Suspense>
  );
}
