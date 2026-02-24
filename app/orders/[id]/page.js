"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/lib/api";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { Search, Package, CheckCircle, Truck, XCircle, RotateCcw, ClipboardCheck } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500", icon: Search, description: "Order received, awaiting confirmation" },
  confirmed: { label: "Confirmed", color: "bg-blue-500", icon: CheckCircle, description: "Order has been confirmed" },
  shipped: { label: "Shipped", color: "bg-purple-500", icon: Truck, description: "Order is on its way" },
  delivered: { label: "Delivered", color: "bg-green-500", icon: Package, description: "Order has been delivered" },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle, description: "Order has been cancelled" },
  returned: { label: "Returned", color: "bg-gray-500", icon: RotateCcw, description: "Order has been returned" },
};

const statusFlow = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { language } = useLanguageStore();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState(orderId || "");

  const fetchOrder = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetchAPI(`/orders`, {
        "filters[order_id][$eq]": id,
        locale: language,
      });

      if (res?.data?.length > 0) {
        setOrder(res.data[0]);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, language]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      window.history.pushState({}, "", `/orders/${searchId.trim()}`);
      fetchOrder(searchId.trim());
    }
  };

  const getCurrency = (currency) => {
    switch (currency) {
      case "RUB": return { prefix: "", suffix: " ₽" };
      case "UZS": return { prefix: "", suffix: " so'm" };
      default: return { prefix: "$", suffix: "" };
    }
  };

  const formatPrice = (price, currency) => {
    const { prefix, suffix } = getCurrency(currency);
    return `${prefix}${Number(price).toFixed(2)}${suffix}`;
  };

  const getCurrentStatusIndex = () => {
    if (!order?.order_status) return 0;
    return statusFlow.indexOf(order.order_status);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title={t("orders.title")} />
        
        <div className="container mt-12 md:mt-24 max-w-xl">
          <div className="bg-background p-8 rounded-3xl border border-border shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {t("orders.searchTitle")}
            </h1>
            
            <form onSubmit={handleSearch}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder={t("orders.searchPlaceholder")}
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <Button type="submit" size="lg">
                  {t("orders.search")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title={t("orders.title")} />
        <div className="container mt-12 md:mt-24 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pb-20">
        <PageHeader title={t("orders.title")} />
        
        <div className="container mt-12 md:mt-24 max-w-xl">
          <div className="bg-background p-8 rounded-3xl border border-border shadow-sm text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t("orders.notFound")}</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            
            <Link href="/orders">
              <Button variant="outline">{t("orders.tryAgain")}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[order.order_status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;
  const currentIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title={t("orders.title")} />

      <div className="container mt-12 md:mt-24 max-w-3xl">
        <div className="bg-background p-8 rounded-3xl border border-border shadow-sm">
          {/* Order ID */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-2xl font-mono font-bold">{order.order_id}</p>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                {t("orders.checkAnother")}
              </Button>
            </Link>
          </div>

          {/* Status Banner */}
          <div className={`p-4 sm:p-6 rounded-xl mb-8 ${currentStatus.color} text-white`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-lg sm:text-xl font-bold">{currentStatus.label}</span>
            </div>
            <p className="text-white/80 text-sm sm:text-base">{currentStatus.description}</p>
          </div>

          {/* Status Progress */}
          <div className="mb-8 overflow-x-auto">
            <h3 className="font-semibold mb-4">{t("orders.tracking")}</h3>
            <div className="flex items-center justify-between relative min-w-[280px] px-2">
              <div className="absolute top-5 left-4 right-4 h-1 bg-muted -z-10" />
              <div 
                className="absolute top-5 left-4 h-1 bg-green-500 -z-10 transition-all"
                style={{ width: `${Math.max(0, (currentIndex / (statusFlow.length - 1)) * 100 - 10)}%` }}
              />
              {statusFlow.map((status, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const config = statusConfig[status];
                const StatusIcon = config.icon;
                
                return (
                  <div key={status} className="flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-2 ${isCurrent ? "font-bold" : ""}`}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">{t("orders.shippingAddress")}</h3>
              <div className="text-muted-foreground">
                <p>{order.first_name} {order.last_name}</p>
                <p>{order.address}</p>
                <p>{order.city}, {order.postal_code}</p>
                <p>{order.email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("orders.orderSummary")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{order.cartItems?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(order.total_price, order.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4">{t("orders.items")}</h3>
            <div className="space-y-3">
              {order.cartItems?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.subTotal, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Link href="/products" className="flex-1">
              <Button className="w-full rounded-full">
                {t("common.continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
