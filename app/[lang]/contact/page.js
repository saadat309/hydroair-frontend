import ContactClient from "./ContactClient";
import { buildDictionarySEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const getSEO = buildDictionarySEO(lang, "contact", "/contact");
  return getSEO();
}

export default function ContactPage() {
  return <ContactClient />;
}
