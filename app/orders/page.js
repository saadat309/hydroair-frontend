"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function OrdersPage() {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      window.location.href = `/orders/${orderId.trim()}`;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t("orders.title")} />
      
      <div className="container mx-auto px-4 pb-12 -mt-5 md:-mt-20 max-w-xl">
        <div className="bg-background p-8 rounded-lg" style={{ boxShadow: "0 4px 15px rgba(var(--color-primary-rgb), 0.15)" }}>
          <div className="text-center mb-8">
            <Search className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {t("orders.searchTitle")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("orders.searchDescription")}
            </p>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="flex gap-3">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={t("orders.searchPlaceholder")}
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <Button type="submit" size="lg">
                {t("orders.search")}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Example:</strong> ORD-123456789
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
