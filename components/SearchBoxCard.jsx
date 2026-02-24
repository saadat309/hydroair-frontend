"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEBOUNCE_DELAY = 500;

export default function SearchBoxCard({ onSearch, initialQuery = "" }) {
  const { t } = useTranslation();
  const [currentInput, setCurrentInput] = useState(initialQuery);

  useEffect(() => {
    setCurrentInput(initialQuery);
  }, [initialQuery]);

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(value);
        }, DEBOUNCE_DELAY);
      };
    })(),
    [onSearch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentInput(value);
    debouncedSearch(value);
  };

  const handleSearchClick = () => {
    clearTimeout(debouncedSearch.timeoutId);
    onSearch(currentInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      clearTimeout(debouncedSearch.timeoutId);
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
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={t("products.searchPlaceholder")}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
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
