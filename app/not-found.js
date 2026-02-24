"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-30">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">
          {t("notFound.title") || "Page Not Found"}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t("notFound.message") || "Sorry, we couldn't find the page you're looking for."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="rounded-full px-8">
              <Home className="w-4 h-4 mr-2" />
              {t("notFound.goHome") || "Go Home"}
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="rounded-full px-8">
              <Search className="w-4 h-4 mr-2" />
              {t("notFound.browseProducts") || "Browse Products"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
