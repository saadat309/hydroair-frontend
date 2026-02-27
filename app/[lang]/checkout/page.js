import CheckoutClient from "./CheckoutClient";
import { buildDictionarySEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const getSEO = buildDictionarySEO(lang, "checkout", "/checkout");
  return getSEO();
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}
