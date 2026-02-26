import { fetchAPI } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hydroairtechnologies.com";
const languages = ["en", "ru", "uz"];
const staticRoutes = ["", "/products", "/about", "/contact", "/cart", "/checkout", "/orders"];

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const urlEntries = [];

  for (const lang of languages) {
    for (const route of staticRoutes) {
      const path = `/${lang}${route}`;
      urlEntries.push({
        loc: `${siteUrl}${path}`,
        lastmod: new Date().toISOString(),
        changefreq: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  try {
    for (const lang of languages) {
      const products = await fetchAPI(
        "/products",
        { locale: lang, fields: "slug,updatedAt", pagination: { pageSize: 100 } },
        { cache: "force-cache", revalidate: 3600 }
      );

      if (products?.data) {
        for (const product of products.data) {
          urlEntries.push({
            loc: `${siteUrl}/${lang}/products/${product.slug}`,
            lastmod: new Date(product.updatedAt).toISOString(),
            changefreq: "weekly",
            priority: 0.7,
          });
        }
      }

      const categories = await fetchAPI(
        "/categories",
        { locale: lang, fields: "slug,updatedAt" },
        { cache: "force-cache", revalidate: 3600 }
      );

      if (categories?.data) {
        for (const category of categories.data) {
          urlEntries.push({
            loc: `${siteUrl}/${lang}/products?category=${category.slug}`,
            lastmod: new Date(category.updatedAt).toISOString(),
            changefreq: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urlEntries) {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${escapeXml(url.loc)}</loc>\n`;
    sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${url.priority}</priority>\n`;
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>';

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
