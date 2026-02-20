"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WavyBadge from "@/components/ui/WavyBadge";

export default function ProductCard({
  product,
  tag,
  priceType = "normal",
  rating = 0,
}) {
  const { t } = useTranslation();
  const { addItem } = useCartStore();

  const { name, slug, image, inStock, price: basePrice } = product;
  const imageUrl = image?.url
    ? `http://localhost:1337${image.url}`
    : "/placeholder-product.svg";

  // Extract price variants from product if available, otherwise use defaults
  const currentPrice = product.newPrice || basePrice;
  const oldPrice = product.oldPrice;
  const minPrice = product.minPrice;
  const maxPrice = product.maxPrice;

  const handleAddToCart = () => {
    addItem({
      id: product.id || product.documentId,
      name: name,
      price: currentPrice,
      image: imageUrl,
    });
    toast.success(`${name} added to cart`);
  };

  return (
    <div className="group rounded-2xl overflow-visible shadow-md bg-card flex flex-col h-full relative">
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
          <div className="w-full h-full flex items-center justify-center text-card-foreground">
            No Image
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow text-center">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold text-lg mb-2 text-card-foreground hover:text-primary transition-colors">
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

        <div className="flex justify-center items-baseline mb-4 mt-auto">
          {priceType === "sale" && oldPrice && (
            <span className="text-muted-foreground line-through mr-2">
              ${oldPrice}
            </span>
          )}
          {priceType === "range" ? (
            <span className="text-xl font-bold text-primary">
              ${minPrice} - ${maxPrice}
            </span>
          ) : (
            <span className="text-xl font-bold text-primary">
              ${currentPrice}
            </span>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center space-x-2 px-6 py-2 w-fit"
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
