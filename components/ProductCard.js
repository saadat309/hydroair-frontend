"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WavyBadge from "@/components/ui/WavyBadge";
import { getStrapiMedia } from "@/lib/api";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";

export default function ProductCard({
  product,
  tag,
  priceType = "normal",
  rating = 0,
}) {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { language } = useLanguageStore();
  
  const [currency, setCurrency] = useState(() => {
    if (product.international_currency) return { prefix: '$', suffix: '' };
    switch (language) {
      case 'ru': return { prefix: '', suffix: ' руб.' };
      case 'uz': return { prefix: '', suffix: " so'm" };
      default: return { prefix: '$', suffix: '' };
    }
  });

  useEffect(() => {
    if (product.international_currency) {
      setCurrency({ prefix: '$', suffix: '' });
    } else {
      switch (language) {
        case 'ru': setCurrency({ prefix: '', suffix: ' руб.' }); break;
        case 'uz': setCurrency({ prefix: '', suffix: " so'm" }); break;
        default: setCurrency({ prefix: '$', suffix: '' });
      }
    }
  }, [language, product.international_currency]);

  const { name, slug, images, inStock, price, old_price, international_currency } = product;
  const imageUrl = getStrapiMedia(images?.[0]?.url) || "/placeholder-product.svg";

  const { prefix, suffix } = currency;

  // Handle case where we might be passed attributes (Strapi 4 style) though we aim for v5
  // const data = product.attributes || product; 

  const handleAddToCart = () => {
    addItem({
      id: product.documentId || product.id,
      name: name,
      price: price,
      image: imageUrl,
      international_currency: international_currency
    });
    toast.success(`${name} added to cart`);
  };

  return (
    <div className="group rounded-2xl overflow-visible shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)] bg-card flex flex-col h-full relative group-hover:shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.5)] transition-shadow duration-300">
      {tag && (
        <div className="absolute -top-6 -right-6 z-10 drop-shadow-md">
          <WavyBadge text={tag} />
        </div>
      )}

      <Link
        href={`/products/${slug}`}
        className="relative aspect-square overflow-hidden rounded-t-2xl flex items-center justify-center p-4 bg-background"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-card-foreground bg-secondary/40">
            {t('products.noImage') || 'No Image'}
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow text-center">
        <Link href={`/products/${slug}`}>
          <h3 className="font-bold text-lg mb-2 text-foreground hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {rating > 0 && (
          <div className="flex justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                  i < rating ? "text-primary" : "text-muted",
              )}
                fill={i < rating ? "currentColor" : "none"}
            />
          ))}
        </div>
        )}

        <div className="flex justify-center items-center gap-2 mb-4 mt-auto">
          {old_price && (
            <span className="text-muted-foreground line-through text-sm">
              {prefix}{old_price}{suffix}
            </span>
          )}
          <span className="text-xl font-bold text-primary">
            {prefix}{price}{suffix}
          </span>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center space-x-2 px-6 py-2 w-fit shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 transition-all"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {inStock ? t("common.addToCart") : t("common.outOfStock")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
