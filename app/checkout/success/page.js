"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t("checkout.title")} />

      <div className="container mt-36 max-w-2xl text-center">
        <div className="bg-background p-12 rounded-3xl border border-border shadow-sm">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
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
