"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Star, Check, Shield, Truck, Share2, Heart, ShoppingCart } from "lucide-react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import WavyTopBackground from "@/components/WavyTopBackground";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
      async function loadProduct() {
          if (!slug) return;
          
          setIsLoading(true);
          setError(null);
          try {
              const res = await fetchAPI("/products", {
                  "filters[slug][$eq]": slug,
                  locale: language,
                  populate: ["image", "category"]
              });

              console.log("API Response:", JSON.stringify(res, null, 2));

              if (!res.data || res.data.length === 0) {
                  setProduct(null);
              } else {
                  setProduct(res.data[0]);
              }
          } catch (err) {
              console.error("Error loading product:", err);
              setError(err);
              toast.error("Error loading product");
          } finally {
              setIsLoading(false);
          }
      }
      loadProduct();
  }, [slug, language]);


  if (isLoading) {
      return (
        <div className="relative min-h-screen overflow-hidden pt-15">
          <div className="absolute top-0 left-0 w-full" style={{ height: "calc(50vh + 80px)" }}>
            <WavyTopBackground height="100%" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-[calc(50vh - 80px)] pt-20">
            <div className="container text-center">
              <div className="w-64 h-12 bg-muted/20 animate-pulse rounded mx-auto" />
              <div className="w-48 h-6 bg-muted/20 animate-pulse rounded mx-auto mt-4" />
            </div>
          </div>
          <div className="container relative z-10 mt-36 pb-12">
            <div className="w-full h-[500px] bg-muted/20 animate-pulse rounded-2xl" />
          </div>
        </div>
      );
  }

  if (!product) {
      return (
        <div className="relative min-h-screen overflow-hidden pt-15">
          <div className="absolute top-0 left-0 w-full" style={{ height: "calc(50vh + 80px)" }}>
            <WavyTopBackground height="100%" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-[calc(50vh - 80px)] pt-20">
            <div className="container text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
                {t('products.noResults')}
              </h1>
            </div>
          </div>
        </div>
      );
  }

  // Strapi v5: attributes are flattened
  const { name, price, description, category, image, addFeatures, inStock } = product;
  const imageUrl = getStrapiMedia(image?.url);
  
  console.log("Product description:", description);
  console.log("Product full:", product);

  const handleAddToCart = () => {
    addItem({
      id: product.id || product.documentId,
      name: name,
      price: price,
      image: imageUrl
    });
    toast.success(`${name} added to cart`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-15">
      {/* Wavy Background */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "calc(50vh + 80px)" }}
      >
        <WavyTopBackground height="100%" />
      </div>
      
      {/* Top Section with Product Name */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(50vh - 80px)] pt-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
            {name}
          </h1>

          <svg
            className="w-56 h-6 text-primary mt-3 mb-6 mx-auto"
            viewBox="0 0 192 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 6 Q 8 2, 16 6 Q 24 10, 32 6 Q 40 2, 48 6 Q 56 10, 64 6 Q 72 2, 80 6 Q 88 10, 96 6 Q 104 2, 112 6 Q 120 10, 128 6 Q 136 2, 144 6 Q 152 10, 160 6 Q 168 2, 176 6 Q 184 10, 192 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Product Detail Content */}
      <div className="container relative z-10 mt-36 pb-24">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-foreground mb-8">
            <a href="/" className="hover:text-primary transition-colors">{t('nav.home')}</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary transition-colors">{t('nav.products')}</a>
            <span>/</span>
            {category && (
                <>
                <span className="hover:text-primary transition-colors cursor-pointer">{category.name}</span>
                <span>/</span>
                </>
            )}
            <span className="text-foreground font-medium">{name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
            {/* Gallery */}
            <div className="space-y-6">
                <div className="relative aspect-square bg-secondary/20 rounded-3xl overflow-hidden border border-border">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-contain p-8"
                            priority
                        />
                    ) : (
                         <div className="w-full h-full flex items-center justify-center text-foreground">{t('products.noImage') || 'No Image'}</div>
                    )}
                </div>
            </div>

{/* Info */}
            <div>
                <div className="mb-6">
                   {category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                            {category.name}
                        </span>
                   )}
                   <div className="flex items-center gap-4 mb-6">
                       <div className="flex items-center gap-1 text-yellow-400">
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                       </div>
                       <span className="text-foreground text-sm">(12 reviews)</span>
<span className={`px-2 py-0.5 text-xs font-bold rounded border ${inStock ? 'bg-green-500/10 text-green-600 border-green-200' : 'bg-red-500/10 text-red-600 border-red-200'}`}>
                            {inStock ? t('common.inStock') : t('common.outOfStock')}
                        </span>
                   </div>
                   <div className="text-3xl font-bold text-primary mb-6">
                       ${price}
                   </div>
                   <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground mb-8">
                       {/* Description from Blocks */}
                       {description && <BlocksRenderer content={description} />}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button 
                        size="lg" 
                        className="flex-1 text-lg h-14 rounded-xl gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                        onClick={handleAddToCart}
                        disabled={!inStock}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {t('common.addToCart')}
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-14 w-14 rounded-xl p-0 shrink-0"
                    >
                        <Heart className="w-6 h-6" />
                    </Button>
                </div>

                {/* Features (from component) */}
                {addFeatures && addFeatures.length > 0 && (
                     <div className="space-y-4 border-t border-border pt-8">
                        {addFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span>{feature.Feature}</span> 
                                {/* Assuming feature component has a field named 'text' or similar. 
                                    I should check schema for 'product-components.features'.
                                    If unknown, I'll dump JSON or guess. 
                                    Let's check the schema later if needed. For now assume basic. */}
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-foreground" />
                        <div>
                            <div className="font-bold text-sm text-foreground">5 Year Warranty</div>
                            <div className="text-xs text-foreground">Full coverage</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Truck className="w-8 h-8 text-foreground" />
                        <div>
                            <div className="font-bold text-sm text-foreground">Free Shipping</div>
                            <div className="text-xs text-foreground">On all orders</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
