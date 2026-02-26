import HeroSection from "@/components/HeroSection";
import BrandStory from "@/components/BrandStory";
import FeaturedProducts from "@/components/FeaturedProducts";
import FiltrationTechnology from "@/components/FiltrationTechnology";
import StatsSection from "@/components/StatsSection";
import FAQSection from "@/components/FAQSection";

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