"use client";

import { useTranslation } from "@/lib/i18n";
import useCartStore from "@/lib/stores/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function CartDrawer({ children }) {
  const { t } = useTranslation();
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCartStore();

  const handleRemove = (id, name) => {
    removeItem(id);
    toast.error(`${name} removed from cart`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 bg-background border-l-border">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="font-heading text-xl">{t('cart.title')}</span>
            <span className="text-sm font-normal text-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                {totalItems} items
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
             <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center text-primary/50">
                <ShoppingCart className="w-8 h-8" />
             </div>
             <p className="text-xl font-semibold text-foreground">{t('cart.empty')}</p>
             <SheetTrigger asChild>
                <Button variant="outline" className="mt-4">{t('common.continueShopping')}</Button>
             </SheetTrigger>
          </div>
        ) : (
            <>
                <ScrollArea className="flex-1 px-6">
                    <div className="flex flex-col gap-6 py-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-20 bg-secondary/20 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                                     {/* Fallback image if no real image */}
                                     {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                     ) : (
                                        <span className="text-xs text-foreground p-1 text-center">{item.name}</span>
                                     )}
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-foreground line-clamp-2 pr-2">{item.name}</h4>
                                        <button 
                                            onClick={() => handleRemove(item.id, item.name)}
                                            className="text-foreground hover:text-destructive transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="flex items-center gap-3 bg-secondary/20 rounded-md px-2 py-1">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-5 h-5 flex items-center justify-center text-primary disabled:opacity-50 hover:bg-white/50 rounded-sm transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-5 h-5 flex items-center justify-center text-primary hover:bg-white/50 rounded-sm transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-6 border-t border-border bg-muted/10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-foreground">{t('common.subtotal')}</span>
                        <span className="text-xl font-bold font-heading text-foreground">${totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-foreground mb-6 text-center">
                        Tax and shipping calculated at checkout.
                    </p>
                    <SheetTrigger asChild>
                        <Link href="/checkout" className="w-full">
                            <Button className="w-full h-12 text-lg font-bold rounded-full">{t('common.checkout')}</Button>
                        </Link>
                    </SheetTrigger>
                </div>
            </>
        )}
      </SheetContent>
    </Sheet>
  );
}
