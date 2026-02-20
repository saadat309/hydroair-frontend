"use client";

import { useTranslation } from "@/lib/i18n";
import useCartStore from "@/lib/stores/useCartStore";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { t } = useTranslation();
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCartStore();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container max-w-6xl">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-8 text-center">{t('cart.title')}</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
             <div className="text-6xl">🛒</div>
             <p className="text-2xl font-semibold text-foreground">{t('cart.empty')}</p>
             <Link href="/products">
                <Button size="lg" className="rounded-full px-8">{t('common.continueShopping')}</Button>
             </Link>
          </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-12 text-foreground">
                
                {/* Cart Items List */}
                <div className="flex-1 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 bg-card p-6 rounded-2xl border border-border items-center">
                            <div className="w-24 h-24 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                                 {/* Fallback image */}
                                 <div className="text-xs text-foreground">{item.name}</div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                <p className="text-foreground text-sm mb-4">{item.category} Filter</p>
                                <div className="text-lg font-bold text-primary">${item.price}</div>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-full"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                
                                <div className="flex items-center gap-3 bg-secondary/30 rounded-lg px-3 py-1.5">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-white rounded-md transition-colors disabled:opacity-50"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                        <h2 className="text-2xl font-bold font-heading mb-6">{t('common.summary')}</h2>
                        
                        <div className="space-y-4 mb-6 text-foreground">
                            <div className="flex justify-between">
                                <span>{t('cart.subtotal')}</span>
                                <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('cart.shipping')}</span>
                                <span className="font-medium text-foreground">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('cart.tax')}</span>
                                <span className="font-medium text-foreground">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-6 mb-8">
                            <div className="flex justify-between text-xl font-bold text-foreground">
                                <span>{t('cart.total')}</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="w-full block">
                            <Button size="lg" className="w-full text-lg font-bold rounded-full py-6 flex items-center justify-center gap-2">
                                {t('common.checkout')}
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
