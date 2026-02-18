"use client";

import HeroSection from "@/components/HeroSection";
import BrandStory from "@/components/BrandStory";
import FeaturedProducts from "@/components/FeaturedProducts";
import FiltrationTechnology from "@/components/FiltrationTechnology";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandStory />
      <FeaturedProducts />
      <FiltrationTechnology />
      <FAQSection />
    </>
  );
}