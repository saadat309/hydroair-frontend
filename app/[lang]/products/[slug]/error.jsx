"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, PackageX } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("Product detail error:", error);
  }, [error]);

  return (
    <div className="container py-8 pt-24 min-h-screen">
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
          <PackageX className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("products.errorLoading") || "Failed to load product"}
        </h2>
        <p className="text-foreground/60 mb-6 max-w-md">
          {error?.message || "We couldn't load this product. Please try again."}
        </p>
        <div className="flex gap-4">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t("common.tryAgain") || "Try Again"}
          </Button>
          <Link href="/products">
            <Button variant="outline">
              {t("nav.products") || "Browse Products"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
