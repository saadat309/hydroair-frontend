import HeroSection from "@/components/HeroSection";
import BrandStory from "@/components/BrandStory";
import FeaturedProducts from "@/components/FeaturedProducts";
import FiltrationTechnology from "@/components/FiltrationTechnology";
import StatsSection from "@/components/StatsSection";
import FAQSection from "@/components/FAQSection";
import { buildDictionarySEO } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const getSEO = buildDictionarySEO(lang, "home", "");
  return getSEO();
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FiltrationTechnology />
      <FeaturedProducts />
      <StatsSection />
      <BrandStory />
      <div className="mt-40">
        <FAQSection />
      </div>
    </>
  );
}