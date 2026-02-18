"use client";

import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Image from "next/image";

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Strapi
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchAPI("/products", {
          locale: language,
          "pagination[limit]": 3,
        });
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [language]);

  useGSAP(() => {
    if (!isLoading && products.length > 0) {
      gsap.from(".product-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      });
    }
  }, { scope: containerRef, dependencies: [isLoading, products] });

  return (
    <section ref={containerRef} className="py-24 bg-background relative z-10">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
                    {t('homepage.products.title')}
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('homepage.products.subtitle')}
                </p>
            </div>
            <Link 
                href="/products" 
                className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
            >
                {t('homepage.products.allProducts')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
               // Skeleton loading state
               Array(3).fill(0).map((_, i) => (
                   <div key={i} className="h-[400px] bg-muted/20 rounded-2xl animate-pulse" />
               ))
            ) : products.length > 0 ? (
                products.map((product) => {
                    const imageUrl = getStrapiMedia(product.image?.url);
                    return (
                        <div key={product.documentId} className="product-card group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            <Link href={`/products/${product.slug}`} className="block">
                                <div className="aspect-square bg-secondary/20 flex items-center justify-center p-8 relative overflow-hidden">
                                    {imageUrl ? (
                                        <Image 
                                            src={imageUrl} 
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">5.0</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-2xl font-bold text-foreground">${product.price}</span>
                                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-3 text-center py-12 text-muted-foreground">
                    No featured products found.
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
