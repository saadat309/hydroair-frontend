"use client";

import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import useCartStore from "@/lib/stores/useCartStore";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { fetchAPI } from "@/lib/api";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";

export default function CartPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateQuantity,
    refreshItem,
  } = useCartStore();
  const [loading, setLoading] = useState(true);

  const getCurrency = (item) => {
    const useInternational = item?.international_currency;
    if (useInternational) return { prefix: "$", suffix: "" };
    switch (language) {
      case "ru":
        return { prefix: "", suffix: " ₽" };
      case "uz":
        return { prefix: "", suffix: " so'm" };
      default:
        return { prefix: "$", suffix: "" };
    }
  };

  const formatPrice = (price, item) => {
    const { prefix, suffix } = getCurrency(item);
    return `${prefix}${price.toFixed(2)}${suffix}`;
  };

  const fetchLocalizedItems = useCallback(async () => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }

    const ids = items.map((item) => item.documentId || item.id);
    try {
      const productsRes = await fetchAPI("/products", {
        locale: language,
        "filters[id][$in]": ids,
        populate: "*",
      });

      if (productsRes?.data) {
        productsRes.data.forEach((product) => {
          const itemId = product.documentId || product.id;
          const imageUrl =
            product.images?.[0]?.formats?.thumbnail || product.images?.[0]?.url;
          const localizedData = {
            name: product.name,
            price: product.price,
            category: product.category?.name,
            international_currency: product.international_currency,
            image: imageUrl,
          };
          refreshItem(itemId, localizedData);
        });
      }
    } catch (error) {
      console.error("Failed to fetch localized products:", error);
    } finally {
      setLoading(false);
    }
  }, [items, language, refreshItem]);

  useEffect(() => {
    setLoading(true);
    fetchLocalizedItems();
  }, [fetchLocalizedItems]);

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t("cart.title")} />

      <div className="container max-w-6xl">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
            <div className="text-6xl">🛒</div>
            <p className="text-2xl font-semibold text-foreground">
              {t("cart.empty")}
            </p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                {t("common.continueShopping")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 text-foreground">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-card p-4 sm:p-6 rounded-2xl border border-border items-start sm:items-center"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-foreground">{item.name}</div>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{item.name}</h3>
                    <p className="text-foreground text-sm mb-2 sm:mb-4">
                      {t("cart.filter")} {item.category}
                    </p>
                    <div className="text-base sm:text-lg font-bold text-primary">
                      {formatPrice(item.price, item)}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4 sm:gap-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 bg-secondary/30 rounded-lg px-3 py-1.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-white rounded-md transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-white rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-card p-8 rounded-3xl border border-border sticky top-32">
                <h2 className="text-2xl font-bold font-heading mb-6">
                  {t("cart.summary")}
                </h2>

                <div className="space-y-4 mb-6 text-foreground">
                  <div className="flex justify-between">
                    <span>{t("common.subtotal")}</span>
                    <span className="font-medium text-foreground">
                      {formatPrice(totalPrice, items[0])}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("common.shipping")}</span>
                    <span className="font-medium text-foreground">
                      {t("cart.calculatedAtCheckout")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("cart.tax")}</span>
                    <span className="font-medium text-foreground">
                      {t("cart.calculatedAtCheckout")}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-6 mb-8">
                  <div className="flex justify-between text-xl font-bold text-foreground">
                    <span>{t("common.total")}</span>
                    <span>{formatPrice(totalPrice, items[0])}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full block">
                  <Button
                    size="lg"
                    className="w-full text-lg font-bold rounded-full py-6 flex items-center justify-center gap-2"
                  >
                    {t("common.checkout")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
