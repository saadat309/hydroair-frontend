import ProductDetailClient from "./ProductDetailClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  
  let product;
  try {
    const res = await fetch(`${strapiUrl}/api/products?locale=${lang}&filters[slug][$eq]=${slug}&populate=seo,images`);
    const data = await res.json();
    product = data.data?.[0];
  } catch (e) {
    console.error("Error fetching product SEO:", e);
  }
  
  if (!product) return { title: "Product Not Found | HydroAir Technologies" };
  
  const seoData = product.seo;
  const title = seoData?.page_title || `${product.name} | HydroAir Technologies`;
  const description = seoData?.page_description || product.shortDescription;
  
  const canonical = `${frontendUrl}/${lang}/products/${slug}`;

  return {
    title,
    description,
    keywords: seoData?.keywords,
    alternates: {
      canonical,
      languages: {
        en: `${frontendUrl}/en/products/${slug}`,
        ru: `${frontendUrl}/ru/products/${slug}`,
        uz: `${frontendUrl}/uz/products/${slug}`,
      },
    },
    robots: seoData?.robots || "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "HydroAir Technologies",
      images: seoData?.og_image ? [{ url: `${strapiUrl}${seoData.og_image.url}` }] : product.images?.[0] ? [{ url: `${strapiUrl}${product.images[0].url}` }] : [],
      type: "article",
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductDetailClient />
    </Suspense>
  );
}
