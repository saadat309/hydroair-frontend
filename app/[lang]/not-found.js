"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  const params = useParams();
  const lang = params?.lang || "en";
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="max-w-md w-full py-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary/50 mb-6 text-primary">
            <Search className="w-12 h-12" />
          </div>
          <h1 className="text-8xl font-black text-primary/20 mb-2">404</h1>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            {t("notFound.title")}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${lang}`} className="flex-1">
            <Button className="w-full h-14 rounded-2xl font-bold text-lg">
              {t("notFound.goHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
