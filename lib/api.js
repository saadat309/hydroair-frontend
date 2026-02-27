import qs from "qs";

export const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
export const STRAPI_MEDIA_URL = process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL || "http://localhost:1337";

/**
 * Fetch data from Strapi API
 * @param {string} endpoint - The API endpoint (e.g., '/products')
 * @param {object} params - Query parameters (e.g., { populate: '*', locale: 'en' })
 * @param {object} options - Optional fetch options (method, body, etc.)
 * @returns {Promise<any>} - The data response
 */
export async function fetchAPI(endpoint, params = {}, options = {}) {
  const method = options.method || params.method || "GET";
  const body = options.body || params.body || null;
  
  const queryParams = { ...params };
  delete queryParams.method;
  delete queryParams.body;
  
  let url = `${STRAPI_API_URL}/api${endpoint}`;
  
  if (method === "GET" && Object.keys(queryParams).length > 0) {
    const queryString = qs.stringify(queryParams, {
      encodeValuesOnly: true,
      arrayFormat: 'brackets',
    });
    url += `?${queryString}`;
  }
  
  const fetchOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    cache: options.cache || (method === "GET" ? "force-cache" : "no-store"),
  };

  if (options.revalidate) {
    fetchOptions.next = { revalidate: options.revalidate };
  }

  if (options.tags) {
    fetchOptions.next = { ...fetchOptions.next, tags: options.tags };
  }
  
  if (method !== "GET" && body) {
    fetchOptions.method = method;
    fetchOptions.body = body;
  }
  
  const res = await fetch(url, fetchOptions);

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
  return `${STRAPI_MEDIA_URL}${cleanUrl}`;
}
