"use client";

import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button"; // Import Button component

export default function FeaturedProducts() {
    const { t } = useTranslation();
    const { language } = useLanguageStore();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };
  
    const itemVariants = {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
    };
  
    // Fetch global setting for featured products
    useEffect(() => {
      async function loadFeaturedProducts() {
        try {
          const globalData = await fetchAPI("/global-setting", {
            locale: language,
          });
          const slugs = globalData?.data?.featured_products?.map(p => p.slug) || [];
          
          if (slugs.length === 0) {
            setIsLoading(false);
            return;
          }

          const productsData = await fetchAPI("/products", {
            locale: language,
            "filters[slug][$in]": slugs,
            "pagination[limit]": 3,
          });
          
          const products = productsData.data || [];
          const sortedProducts = slugs.map(slug => 
            products.find(p => p.slug === slug)
          ).filter(Boolean);
          
          setProducts(sortedProducts);
        } catch (error) {
          console.error("Failed to load featured products:", error);
        } finally {
          setIsLoading(false);
        }
      }
      loadFeaturedProducts();
    }, [language]);
  
    return (
      products.length > 0 && (
      <section className="py-24 bg-secondary relative z-10">
        {/* Wave Background SVG */}
        <div className="absolute inset-0 h-full w-full pointer-events-none z-0">
          <svg
            className="w-full h-full text-background"
            viewBox="0 0 1440 800"
            fill="none"
            preserveAspectRatio="none"
          >
            <g transform="scale(-1, 1) translate(-1440, 0)">
              {/* Top Wave: new downward pattern, horizontally flipped */}
              <path
                d="M0 0 C 140 460, 480 0, 720 100 S 1200 0, 1440 160 V 0 Z"
                fill="currentColor"
              />
            </g>
            {/* Bottom Wave: different S-curves, more pronounced */}
            <path
              d="M0 800 C 200 750, 500 400, 600 550 S 1000 700, 1440 550 V 800 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col justify-center items-center mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
              {t("homepage.products.title_part1")}{" "}
              <span className="text-primary">
                {t("homepage.products.title_part2")}
              </span>
            </h2>
            <p className="text-foreground text-lg">
              {t("homepage.products.subtitle")}
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto p-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {isLoading ? (
              // Skeleton loading state
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-[400px] bg-muted/20 rounded-2xl animate-pulse"
                  />
                ))
            ) : products.length > 0 ? (
              products.map((product, index) => {
                const dummyPrice = product.price || 25.00; // Fallback dummy price
                const tags = ["SALE", "NEW", "15% OFF"];
                const priceTypes = ["sale", "normal", "range"];

                const tag = tags[index % tags.length];
                const priceType = priceTypes[index % priceTypes.length];
                const oldPrice = (dummyPrice * 1.2).toFixed(2);
                const newPrice = dummyPrice.toFixed(2);
                const minPrice = (dummyPrice * 0.8).toFixed(2);
                const maxPrice = (dummyPrice * 1.1).toFixed(2);

                return (
                  <motion.div
                    key={product.documentId}
                    className="group relative"
                    variants={itemVariants}
                  >
                    <ProductCard
                      product={{ ...product, oldPrice, newPrice, minPrice, maxPrice }}
                      tag={tag}
                      priceType={priceType}
                      rating={4.5}
                    />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12 text-foreground">
                No featured products found.
              </div>
            )}
          </motion.div>

          <div className="mt-12 text-center">
            <Link href="/products" passHref>
              <Button
                asChild
                className="px-8 py-3 text-lg bg-primary text-primary-foreground rounded-full ease-in-out shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
              >
                <span>{t("homepage.products.allProducts")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )
    );
  }

