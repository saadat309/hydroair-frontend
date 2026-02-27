import CartClient from "./CartClient";
import { buildDictionarySEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const getSEO = buildDictionarySEO(lang, "cart", "/cart");
  return getSEO();
}

export default function CartPage() {
  return <CartClient />;
}
