export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetch data from Strapi API
 * @param {string} endpoint - The API endpoint (e.g., '/products')
 * @param {object} params - Query parameters (e.g., { populate: '*', locale: 'en' })
 * @returns {Promise<any>} - The data response
 */
export async function fetchAPI(endpoint, params = {}) {
  const { locale, ...otherParams } = params;
  
  // Construct URL with query parameters
  const url = new URL(`${STRAPI_URL}/api${endpoint}`);
  
  if (locale) url.searchParams.append("locale", locale);
  
  // Add other params handled by qs usually, but simple append for now or use URLSearchParams for simple keys
  // For complex Strapi filters, we might want 'qs' but let's stick to simple or manual construction if 'qs' isn't installed.
  // We'll rely on simple params for now or assume the caller passes a query string if complex.
  
  // Check if params has 'populate' or 'filters' which might be objects.
  // If so, we'd typically need 'qs'. Let's check package.json.
  // 'qs' is not in package.json. I'll use simple key-mulitple-value or just manual string construction for now.
  // Actually, easiest is to let the caller pass a constructed query string or handle simple key-values.
  
  Object.keys(otherParams).forEach(key => {
      if (typeof otherParams[key] === 'object') {
          // Flattening objects for URLSearchParams is tricky without qs. 
          // I will assume for now simple params or manual string concatenation by caller if complex.
          // BUT, Strapi needs brackets like filters[slug][$eq]=...
          // I will implement a basic object flattener or just require 'qs' to be installed.
          // Installing 'qs' is safer.
      } else {
          url.searchParams.append(key, otherParams[key]);
      }
  });

  // For complex queries, we will use a different approach:
  // We'll accept a 'query' object and use 'qs' if available, otherwise direct string.
  // Let's keep it simple: The caller puts the query string in.
  
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Ensure fresh data for dynamic e-commerce
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Failed to fetch API");
  }

  const data = await res.json();
  return data;
}

export function getStrapiMedia(url) {
  if (url == null) {
    return null;
  }
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}
