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
import { StarRating } from "./StarRating";

export default function ProductCard({ product, priceType = "normal" }) {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { language } = useLanguageStore();

  const badgeTag = product?.tags?.find(tag => tag.display_as_Badge === true);

  const [currency, setCurrency] = useState(() => {
    if (product.international_currency) return { prefix: "$", suffix: "" };
    switch (language) {
      case "ru":
        return { prefix: "", suffix: " ₽" };
      case "uz":
        return { prefix: "", suffix: " so'm" };
      default:
        return { prefix: "$", suffix: "" };
    }
  });

  useEffect(() => {
    if (product.international_currency) {
      setCurrency({ prefix: "$", suffix: "" });
    } else {
      switch (language) {
        case "ru":
          setCurrency({ prefix: "", suffix: " ₽" });
          break;
        case "uz":
          setCurrency({ prefix: "", suffix: " so'm" });
          break;
        default:
          setCurrency({ prefix: "$", suffix: "" });
      }
    }
  }, [language, product.international_currency]);

  const {
    name,
    slug,
    images,
    inStock,
    price,
    old_price,
    international_currency,
    reviews,
  } = product;
  const imageUrl =
    getStrapiMedia(images?.[0]?.formats?.medium) ||
    getStrapiMedia(images?.[0]?.url) ||
    "/placeholder-product.svg";

  console.log("ProductCard - reviews:", JSON.stringify(reviews, null, 2));

  const approvedReviews = reviews?.filter((r) => r.is_approved === true) || [];
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) /
        approvedReviews.length
      : 5;

  const { prefix, suffix } = currency;

  // Handle case where we might be passed attributes (Strapi 4 style) though we aim for v5
  // const data = product.attributes || product;

  const handleAddToCart = () => {
    const thumbUrl =
      getStrapiMedia(images?.[0]?.formats?.thumbnail) || imageUrl;
    addItem({
      id: product.documentId || product.id,
      name: name,
      price: price,
      image: thumbUrl,
      international_currency: international_currency,
    });
    toast.success(`${name} added to cart`);
  };

  return (
    <div className="group rounded-2xl overflow-visible shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)] bg-card flex flex-col h-full relative group-hover:shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.5)] transition-shadow duration-300">
      {badgeTag && (
        <div className="absolute -top-6 -right-6 z-10 drop-shadow-md">
          <WavyBadge text={badgeTag.name} />
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
            {t("products.noImage") || "No Image"}
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow text-center">
        <Link href={`/products/${slug}`}>
          <h3 className="font-bold text-lg mb-2 text-foreground hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex justify-center">
          <StarRating
            rating={averageRating}
            showValue={true}
            showInBrackets={true}
            size="default"
          />
        </div>

        <div className="flex justify-center items-center gap-2 mb-4 mt-auto">
          {old_price && (
            <span className="text-muted-foreground line-through text-sm">
              {prefix}
              {old_price}
              {suffix}
            </span>
          )}
          <span className="text-xl font-bold text-foreground">
            {prefix}
            {price}
            {suffix}
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
