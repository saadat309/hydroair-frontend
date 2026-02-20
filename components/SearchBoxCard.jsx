"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { Search } from "lucide-react"; // Assuming Search icon is still needed
import { Button } from "@/components/ui/button"; // Import Button component
import { cn } from "@/lib/utils"; // For combining class names

export default function SearchBoxCard({ onSearch, initialQuery = "" }) {
  const { t } = useTranslation();
  const [currentInput, setCurrentInput] = useState(initialQuery);

  useEffect(() => {
    setCurrentInput(initialQuery);
  }, [initialQuery]);

  const handleSearchClick = () => {
    onSearch(currentInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(currentInput);
    }
  };

  return (
<div className="bg-card rounded-lg p-6 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)]">
      <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center">
        <span className="inline-block w-[3px] h-5 bg-primary mr-1 translate-y-[2px] rounded-full" />
        {t("products.searchByProducts")}
      </h3>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder={t("products.searchPlaceholder")}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-4 pr-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
          />
        </div>
        <Button
          onClick={handleSearchClick}
          className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {t("common.search")}
        </Button>
      </div>
    </div>
  );
}
