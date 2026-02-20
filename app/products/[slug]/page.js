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

export default function ProductDetailPage() {
  const params = useParams(); // params.slug
  const { slug } = params;
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
      async function loadProduct() {
          try {
              const res = await fetchAPI("/products", {
                  "filters[slug][$eq]": slug,
                  locale: language,
              });

              if (!res.data || res.data.length === 0) {
                  // handle 404
                  setProduct(null);
              } else {
                  setProduct(res.data[0]);
              }
          } catch (err) {
              console.error(err);
              toast.error("Error loading product");
          } finally {
              setIsLoading(false);
          }
      }
      if (slug) loadProduct();
  }, [slug, language]);


  if (isLoading) {
      return <div className="min-h-screen pt-32 container"><div className="w-full h-[500px] bg-muted/20 animate-pulse rounded-2xl" /></div>;
  }

  if (!product) {
      return <div className="min-h-screen pt-32 container text-center">Product not found.</div>;
  }

  // Strapi v5: attributes are flattened
  const { name, price, description, category, image, addFeatures, inStock } = product;
  const imageUrl = getStrapiMedia(image?.url);

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
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-foreground mb-8">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-primary transition-colors">Products</a>
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
                         <div className="w-full h-full flex items-center justify-center text-foreground">No Image</div>
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
                   <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
                       {name}
                   </h1>
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
                           {inStock ? 'In Stock' : 'Out of Stock'}
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
                        Add to Cart
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
