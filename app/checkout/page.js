"use client";

import { useTranslation } from "@/lib/i18n";
import useCartStore from "@/lib/stores/useCartStore";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { items, totalPrice } = useCartStore();

  if (items.length === 0) {
     return (
        <div className="min-h-screen bg-background pt-32 pb-20 text-center container">
             <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
             <Link href="/products" className="text-primary hover:underline">Return to Shop</Link>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-secondary/10 pt-32 pb-20">
      <div className="container max-w-6xl">
        <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
            </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Checkout Form */}
            <div className="flex-1 bg-background p-8 rounded-3xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold font-heading mb-8">{t('common.checkout')}</h2>
                
                <form className="space-y-8">
                    {/* Contact Info */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Information</h3>
                        <div className="grid gap-4">
                            <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                        </div>
                    </section>

                    {/* Shipping Address */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Shipping Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="First name" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder="Last name" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder="Address" className="w-full md:col-span-2 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder="City" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                            <input type="text" placeholder="Postal code" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                        </div>
                    </section>

                    {/* Payment Placeholder */}
                    <section>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Payment</h3>
                        <div className="p-6 bg-secondary/20 rounded-xl border border-dashed border-primary/30 text-center text-foreground">
                            Payment integration coming soon.
                        </div>
                    </section>

                    <Button size="lg" className="w-full text-lg font-bold rounded-full py-6">
                        Complete Order
                    </Button>
                </form>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
                <div className="bg-background p-8 rounded-3xl border border-border shadow-sm sticky top-32">
                    <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                    
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
                                    <p className="text-sm text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2 mb-6 text-sm">
                         <div className="flex justify-between">
                            <span className="text-foreground">Subtotal</span>
                            <span className="font-medium">${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-foreground">Shipping</span>
                            <span className="font-medium">Free</span>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <div className="flex justify-between text-xl font-bold text-foreground">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
