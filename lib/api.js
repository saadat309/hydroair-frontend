import qs from "qs";

export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Fetch data from Strapi API
 * @param {string} endpoint - The API endpoint (e.g., '/products')
 * @param {object} params - Query parameters (e.g., { populate: '*', locale: 'en' })
 * @returns {Promise<any>} - The data response
 */
export async function fetchAPI(endpoint, params = {}) {
  // Use qs to stringify params into a format Strapi understands
  const queryString = qs.stringify(params, {
    encodeValuesOnly: true, // Only encode the values, not the keys
    arrayFormat: 'brackets', // Use brackets for array parameters, e.g., `categories[0]=1`
  });

  const url = new URL(`${STRAPI_URL}/api${endpoint}?${queryString}`);
  
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Ensure fresh data for dynamic e-commerce
  });

  if (!res.ok) {
    const error = await res.json();
    console.error(`Strapi API Error (${endpoint}):`, error);
    throw new Error(error.error?.message || "Failed to fetch API");
  }

  const data = await res.json();
  return data;
}

/**
 * Get full Strapi Media URL
 * @param {string} url - The relative URL from Strapi
 * @returns {string|null} - The absolute URL
 */
export function getStrapiMedia(url) {
  if (url == null) {
    return null;
  }
  
  // Handle already absolute URLs or protocol-relative URLs
  if (url.startsWith("http") || url.startsWith("//") || url.startsWith("data:")) {
    return url;
  }
  
  // Ensure the URL starts with a slash for concatenation
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${STRAPI_URL}${cleanUrl}`;
}
