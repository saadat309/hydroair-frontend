"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CheckCircle, Send, MessageCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const payment = searchParams.get("payment");
  const isOnline = payment === "ONLINE";
  
  const contactMessage = `Hello, I have placed an order ${orderId} using the ONLINE payment method. Please help me with the next steps.`;
  const telegramUrl = `https://t.me/Saadat_Yaseen?text=${encodeURIComponent(contactMessage)}`;
  const whatsappUrl = `https://wa.me/03145982936?text=${encodeURIComponent(contactMessage)}`;

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t("checkout.title")} />

      <div className="container mx-auto px-4 pb-12 -mt-5 md:-mt-20 max-w-2xl text-center">
        <div className="bg-background p-12 rounded-lg" style={{ boxShadow: "0 4px 15px rgba(var(--color-primary-rgb), 0.15)" }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-foreground">
            {t("checkout.success.title")}
          </h1>

          <p className="text-foreground mb-2">
            {t("checkout.success.message")}
          </p>

          {orderId && (
            <p className="text-sm text-muted-foreground mb-8">
              Order ID: <span className="font-mono font-bold">{orderId}</span>
            </p>
          )}

          {isOnline && (
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shrink-0">
                 <Send className="w-6 h-6 text-blue-600 dark:text-blue-400 ml-1" />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">{t("checkout.success.onlineVerification")}</h3>
                 <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mb-4">
                   {t("checkout.success.onlineDesc")}
                 </p>
                 <div className="flex flex-col sm:flex-row gap-3">
                   <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="bg-[#0088cc] hover:bg-[#0077b5] text-white gap-2 w-full">
                        <Send className="w-4 h-4" /> {t("checkout.success.telegramBtn")}
                      </Button>
                   </a>
                   <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 w-full">
                        <MessageCircle className="w-4 h-4" /> {t("checkout.success.whatsappBtn")}
                      </Button>
                   </a>
                 </div>
               </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/products`}>
              <Button size="lg" className="rounded-full px-8">
                {t("common.continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
