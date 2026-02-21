"use client";

import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import useCartStore from "@/lib/stores/useCartStore";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { fetchAPI } from "@/lib/api";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { items, totalPrice, refreshItem } = useCartStore();
  const [loading, setLoading] = useState(true);

  const getCurrency = (item) => {
    const useInternational = item?.international_currency;
    if (useInternational) return { prefix: '$', suffix: '' };
    switch (language) {
      case 'ru': return { prefix: '', suffix: ' руб.' };
      case 'uz': return { prefix: '', suffix: " so'm" };
      default: return { prefix: '$', suffix: '' };
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
    
    const ids = items.map(item => item.documentId || item.id);
    try {
      const productsRes = await fetchAPI("/products", { 
        locale: language,
        'filters[id][$in]': ids,
        populate: '*'
      });
      
      if (productsRes?.data) {
        productsRes.data.forEach(product => {
          const itemId = product.documentId || product.id;
          const localizedData = {
            name: product.name,
            price: product.price,
            category: product.category?.name,
            international_currency: product.international_currency
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

  if (items.length === 0) {
     return (
        <div className="min-h-screen pb-20">
            <PageHeader title={t('checkout.title')} />
            <div className="container mt-36 text-center">
                <h1 className="text-3xl font-bold mb-4">{t('cart.empty')}</h1>
                <Link href="/products" className="text-primary hover:underline">{t('common.continueShopping')}</Link>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t('checkout.title')} />
      
      <div className="container max-w-6xl">
        <div className="mb-8">
<Link href="/cart" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('checkout.backToCart')}
            </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Checkout Form */}
            <div className="flex-1 bg-background p-8 rounded-3xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold font-heading mb-8">{t('common.checkout')}</h2>
                
                <form className="space-y-8">
{/* Contact Info */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t('checkout.contactInfo')}</h3>
                        <div className="grid gap-4">
                            <input type="email" placeholder={t('checkout.billing.emailPlaceholder')} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                        </div>
                    </section>

                    {/* Shipping Address */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t('checkout.shippingAddress')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder={t('checkout.billing.firstNamePlaceholder')} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder={t('checkout.billing.lastNamePlaceholder')} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder={t('checkout.billing.addressPlaceholder')} className="w-full md:col-span-2 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder={t('checkout.billing.cityPlaceholder')} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder={t('checkout.billing.postalCodePlaceholder')} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                        </div>
                    </section>

                    {/* Payment Placeholder */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">{t('checkout.paymentSection')}</h3>
                        <div className="p-6 bg-secondary/20 rounded-xl border border-dashed border-primary/30 text-center text-foreground">
                            {t('checkout.paymentComingSoon')}
                        </div>
                    </section>

                    <Button size="lg" className="w-full text-lg font-bold rounded-full py-6">
                        {t('checkout.completeOrder')}
                    </Button>
                </form>
            </div>

            {/* Order Summary */}
<div className="w-full lg:w-96 shrink-0">
                <div className="bg-background p-8 rounded-3xl border border-border shadow-sm sticky top-32">
                    <h3 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h3>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-secondary">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start">
                                <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                                     <div className="text-[10px] text-foreground px-1 text-center">{item.name}</div>
                                     <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                                        {item.quantity}
                                     </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold line-clamp-2">{item.name}</h4>
                                    <p className="text-sm text-primary font-bold">{formatPrice(item.price * item.quantity, item)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2 mb-6 text-sm">
                         <div className="flex justify-between">
                            <span className="text-foreground">{t('common.subtotal')}</span>
                            <span className="font-medium">{formatPrice(totalPrice, items[0])}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-foreground">{t('common.shipping')}</span>
                            <span className="font-medium">{t('common.free')}</span>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <div className="flex justify-between text-xl font-bold text-foreground">
                            <span>{t('common.total')}</span>
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
