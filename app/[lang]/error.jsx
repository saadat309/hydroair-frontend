"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("common.error") || "Something went wrong"}
        </h2>
        <p className="text-foreground/60 mb-6">
          {error?.message || t("common.errorMessage") || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t("common.tryAgain") || "Try Again"}
          </Button>
        </div>
      </div>
    </div>
  );
}
