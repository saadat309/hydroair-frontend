import OrdersClient from "./OrdersClient";
import { buildDictionarySEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const getSEO = buildDictionarySEO(lang, "orders", "/orders");
  return getSEO();
}

export default function OrdersPage() {
  return <OrdersClient />;
}
