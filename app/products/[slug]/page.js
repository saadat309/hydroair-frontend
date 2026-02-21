"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Star, Check, Shield, Truck, Share2, Heart, ShoppingCart, Minus, Plus, Search } from "lucide-react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import WavyTopBackground from "@/components/WavyTopBackground";
import { cn } from "@/lib/utils";
import ProductReviews from "@/components/ProductReviews";

const WavyDivider = () => (
  <div className="w-full h-3 text-primary/40 my-6 select-none pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1200 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 6C30 2 60 2 90 6C120 10 150 10 180 6C210 2 240 2 270 6C300 10 330 10 360 6C390 2 420 2 450 6C480 10 510 10 540 6C570 2 600 2 630 6C660 10 690 10 720 6C750 2 780 2 810 6C840 10 870 10 900 6C930 2 960 2 990 6C1020 10 1050 10 1080 6C1110 2 1140 2 1170 6C1200 10 1230 10 1260 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
      async function loadProduct() {
          if (!slug) return;
          
          setIsLoading(true);
          setError(null);
          try {
              const res = await fetchAPI("/products", {
                  "filters[slug][$eq]": slug,
                  locale: language,
                  populate: ["images", "category", "addFeatures", "tags"]
              });

              console.log("Product API Response:", JSON.stringify(res.data?.[0], null, 2));

              if (!res.data || res.data.length === 0) {
                  setProduct(null);
              } else {
                  setProduct(res.data[0]);
                  
                  // Fetch related products from same category
                  const currentProduct = res.data[0];
                  if (currentProduct.category?.id) {
                      const relatedRes = await fetchAPI("/products", {
                          locale: language,
                          "filters[category][id][$eq]": currentProduct.category.id,
                          "filters[id][$ne]": currentProduct.documentId || currentProduct.id,
                          populate: ["images", "category"],
                          "pagination[limit]": 4
                      });
                      if (relatedRes.data) {
                          setRelatedProducts(relatedRes.data);
                      }
                  }
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
  const { name, price, old_price, international_currency, description, category, images, addFeatures, inStock, SKU, tags } = product;
  const imageUrl = getStrapiMedia(images?.[activeImage]?.url || images?.[0]?.url);
  
  // Currency helper
  const getCurrency = () => {
    if (international_currency) return { prefix: '$', suffix: '' };
    switch (language) {
      case 'ru': return { prefix: '', suffix: ' руб.' };
      case 'uz': return { prefix: '', suffix: " so'm" };
      default: return { prefix: '$', suffix: '' };
    }
  };
  const { prefix, suffix } = getCurrency();

  const handleAddToCart = () => {
    addItem({
      id: product.documentId || product.id,
      name: name,
      price: price,
      image: imageUrl,
      quantity: quantity
    });
    toast.success(`${quantity} ${name} added to cart`);
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

          <div className="flex flex-col items-center gap-2 mt-2">
            <svg
              className="w-56 h-6 text-primary"
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
      </div>

      <div className="container relative z-10 mt-36 pb-24">
        <div className="relative bg-card rounded-lg overflow-hidden z-20" style={{ boxShadow: '0 4px 15px rgba(var(--color-primary-rgb), 0.15)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Gallery Section */}
            <div className="p-8 lg:p-16 flex flex-col items-center bg-card lg:sticky lg:top-8 lg:h-fit">
              <div className="relative group w-full aspect-square max-w-[500px]">
                <div className="absolute top-4 right-4 z-20">
                  <button className="p-3 bg-card border border-border rounded-full shadow-lg text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-card-foreground bg-secondary rounded-lg font-bold italic">
                    {t('products.noImage') || 'No Image'}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images && images.length > 1 && (
                <div className="flex gap-4 mt-12 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                        activeImage === idx ? "border-primary shadow-md" : "border-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                      )}
                    >
                      <Image src={getStrapiMedia(img.url)} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-16 flex flex-col">
              <WavyDivider />
              
              <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1 text-primary">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn("w-6 h-6", i < 5 ? "fill-current" : "opacity-30")} />
                                ))}
                              </div>                <span className="text-muted-foreground text-sm font-medium">(4 customer reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-8">
                <h2 className="text-3xl lg:text-4xl font-black text-primary tracking-tight">
                  {prefix}{price}{suffix}
                </h2>
                {old_price && (
                  <span className="text-xl text-muted-foreground line-through font-bold">
                    {prefix}{old_price}{suffix}
                  </span>
                )}
              </div>

              {/* Description Box */}
              <div className="bg-secondary rounded-lg p-6 lg:p-8 mb-8 text-foreground leading-relaxed font-medium border border-border">
                {description && <BlocksRenderer content={description} />}
              </div>

              <WavyDivider />

              {/* Action Area */}
              <div className="mb-8">
                <div className="bg-secondary rounded-lg p-6 mb-6 inline-block border border-border">
                  <span className="text-3xl font-black text-primary">
                    {prefix}{price * quantity}{suffix}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-card border-2 border-secondary rounded-full p-1 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-secondary rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-primary hover:bg-secondary rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button 
                    size="lg" 
                    className="flex-1 h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:shadow-2xl transition-all active:scale-95 shadow-xl"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>

              <WavyDivider />

              {/* Metadata Section */}
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-[2px] h-4 bg-primary rounded-full" />
                  <div className="text-sm">
                    <span className="text-foreground font-bold uppercase tracking-tight">SKU:</span>
                    <span className="text-muted-foreground ml-2 font-medium">{SKU || 'N/A'}</span>
                  </div>
                </div>

                {category && (
                  <div className="flex items-center gap-2">
                    <div className="w-[2px] h-4 bg-primary rounded-full" />
                    <div className="text-sm">
                      <span className="text-foreground font-bold uppercase tracking-tight">Category:</span>
                      <span className="ml-2 bg-secondary text-primary px-3 py-0.5 rounded-full text-xs font-bold border border-primary/10">
                        {category.name}
                      </span>
                    </div>
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <div className="w-[2px] h-4 bg-primary rounded-full mt-1" />
                    <div className="text-sm flex flex-wrap items-center">
                      <span className="text-foreground font-bold uppercase tracking-tight mr-2">Tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <span key={idx} className="bg-secondary text-primary px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-primary/5 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <WavyDivider />
            </div>
          </div>
        </div>

        {/* Detail Description - Full Width */}
        <div className="mt-6">
          <div className="relative bg-card rounded-lg overflow-hidden z-10" style={{ boxShadow: '0 4px 15px rgba(var(--color-primary-rgb), 0.1)' }}>
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <div className="w-[3px] h-6 bg-primary rounded-full" />
                {t('products.details.description')}
              </h3>
              <div className="bg-secondary rounded-xl p-6 lg:p-8 text-foreground leading-relaxed font-medium">
                {description ? (
                  <BlocksRenderer content={description} />
                ) : (
                  <p className="text-muted-foreground italic">No description available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews & Related Products */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* Reviews Card - 60% */}
          <div className="lg:col-span-3">
            <ProductReviews productId={product?.documentId || product?.id} />
          </div>

          {/* Related Products Card - 40% */}
          <div className="lg:col-span-2 relative bg-card rounded-lg overflow-hidden z-10" style={{ boxShadow: '0 4px 15px rgba(var(--color-primary-rgb), 0.1)' }}>
            <div className="p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-[3px] h-5 bg-primary rounded-full" />
                {t('products.details.related')}
              </h3>
              {relatedProducts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {relatedProducts.map((relProduct) => (
                    <Link 
                      key={relProduct.id} 
                      href={`/products/${relProduct.slug}`}
                      className="flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {relProduct.images?.[0]?.url ? (
                          <Image 
                            src={getStrapiMedia(relProduct.images[0].url)} 
                            alt={relProduct.name} 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground p-1">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 text-foreground">{relProduct.name}</h4>
                        <p className="text-primary font-bold text-sm mt-1">
                          {relProduct.international_currency ? '$' : language === 'ru' ? '' : language === 'uz' ? '' : '$'}
                          {relProduct.price}
                          {relProduct.international_currency ? '' : language === 'ru' ? ' руб.' : language === 'uz' ? " so'm" : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No related products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}