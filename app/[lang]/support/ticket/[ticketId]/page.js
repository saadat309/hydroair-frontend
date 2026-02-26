import TicketDetailsClient from "./TicketDetailsClient";
import { buildDictionarySEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const getSEO = buildDictionarySEO(lang, "support", "/support");
  return getSEO();
}

export default function TicketDetailsPage(props) {
  return <TicketDetailsClient {...props} />;
}
