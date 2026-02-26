import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import { buildDictionarySEO, fetchStrapiSEO, buildStrapiSEO } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const tag = resolvedSearchParams?.tag;
  
  let seoData = null;
  let path = "/products";
  
  if (category) {
    seoData = await fetchStrapiSEO("categories", lang, category);
    path = `/products?category=${category}`;
  } else if (tag) {
    seoData = await fetchStrapiSEO("tags", lang, tag);
    path = `/products?tag=${tag}`;
  }
  
  if (seoData) {
    return buildStrapiSEO(seoData, lang, path);
  }
  
  const getSEO = buildDictionarySEO(lang, "products", path);
  return getSEO();
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductsClient />
    </Suspense>
  );
}
