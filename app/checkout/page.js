"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import useCartStore from "@/lib/stores/useCartStore";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { fetchAPI } from "@/lib/api";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { z } from "zod";
import { toast } from "sonner";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});

  const getCurrency = (item) => {
    const useInternational = item?.international_currency;
    if (useInternational) return { prefix: "$", suffix: "", code: "USD" };
    switch (language) {
      case "ru":
        return { prefix: "", suffix: " ₽", code: "RUB" };
      case "uz":
        return { prefix: "", suffix: " so'm", code: "UZS" };
      default:
        return { prefix: "$", suffix: "", code: "USD" };
    }
  };

  const formatPrice = (price, item) => {
    const { prefix, suffix } = getCurrency(item);
    return `${prefix}${price.toFixed(2)}${suffix}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      checkoutSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const currency = getCurrency(items[0]);
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const cartItems = items.map((item) => ({
        title: item.name,
        product: item.documentId || item.id,
        quantity: item.quantity,
        subTotal: String(item.price * item.quantity),
      }));

      const orderData = {
        order_id: orderId,
        slug: orderId.toLowerCase(),
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postal_code: formData.postalCode,
        cartItems,
        total_price: String(totalPrice),
        currency: currency.code,
        order_status: "pending",
      };

      const res = await fetchAPI("/orders", {
        method: "POST",
        body: JSON.stringify({ data: orderData }),
      });

      if (res.data) {
        toast.success("Order placed successfully!");
        clearCart();
        window.location.href = `/checkout/success?order=${orderId}`;
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          useCartStore.getState().refreshItem(itemId, localizedData);
        });
      }
    } catch (error) {
      console.error("Failed to fetch localized products:", error);
    } finally {
      setLoading(false);
    }
  }, [items, language]);

  useEffect(() => {
    setLoading(true);
    fetchLocalizedItems();
  }, [fetchLocalizedItems]);

  const inputClass = (fieldName) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[fieldName] ? "border-red-500" : "border-input"
    } bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title={t("checkout.title")} />
        <div className="container mt-36 text-center">
          <h1 className="text-3xl font-bold mb-4">{t("cart.empty")}</h1>
          <Link href="/products" className="text-primary hover:underline">
            {t("common.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t("checkout.title")} />

      <div className="container max-w-6xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("checkout.backToCart")}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Checkout Form */}
          <div className="flex-1 bg-background p-4 md:p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold font-heading mb-8">
              {t("common.checkout")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {t("checkout.contactInfo")}
                </h3>
                <div className="grid gap-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.emailPlaceholder")}
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {t("checkout.shippingAddress")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.firstNamePlaceholder")}
                      className={inputClass("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.lastNamePlaceholder")}
                      className={inputClass("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.addressPlaceholder")}
                      className={inputClass("address")}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.cityPlaceholder")}
                      className={inputClass("city")}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.countryPlaceholder")}
                      className={inputClass("country")}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder={t("checkout.billing.postalCodePlaceholder")}
                      className={inputClass("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment Placeholder */}
              <section>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {t("checkout.paymentSection")}
                </h3>
                <div className="p-6 bg-secondary/20 rounded-xl border border-dashed border-primary/30 text-center text-foreground">
                  {t("checkout.paymentComingSoon")}
                </div>
              </section>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg font-bold rounded-full py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("checkout.processing") : t("checkout.completeOrder")}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-background p-4 md:p-8 rounded-3xl border border-border shadow-sm lg:sticky lg:top-32">
              <h3 className="text-xl font-bold mb-6">
                {t("checkout.orderSummary")}
              </h3>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-secondary">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-[10px] text-foreground px-1 text-center">
                          {item.name}
                        </div>
                      )}
                      <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-primary font-bold">
                        {formatPrice(item.price * item.quantity, item)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground">
                    {t("common.subtotal")}
                  </span>
                  <span className="font-medium">
                    {formatPrice(totalPrice, items[0])}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">
                    {t("common.shipping")}
                  </span>
                  <span className="font-medium">{t("common.free")}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>{t("common.total")}</span>
                  <span>{formatPrice(totalPrice, items[0])}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
