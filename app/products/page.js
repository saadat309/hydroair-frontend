"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import { Filter, ShoppingCart } from "lucide-react";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import WavyTopBackground from "@/components/WavyTopBackground";
import SearchBoxCard from "@/components/SearchBoxCard";
import CategoryCard from "@/components/CategoryCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();
  
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState("default"); // New state for sorting
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesRes = await fetchAPI("/categories", { locale: language });
        setCategories(categoriesRes.data || []);

        // Prepare product filters
        const productFilters = {
          locale: language,
          populate: ["images", "category"],
        };

        if (selectedCategory !== "all") {
          productFilters["filters[category][slug][$eq]"] = selectedCategory;
        }

        // Fetch products
        const productsRes = await fetchAPI("/products", productFilters);
        setProducts(productsRes.data || []);

      } catch (error) {
        console.error("Failed to fetch products or categories:", error);
        toast.error("Error loading products or categories.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [language, selectedCategory]);

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden pt-15">
      {" "}
      {/* Add pt-20 to account for fixed navbar */}
      {/* Wavy Background covering the top 50vh of content below navbar */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: "calc(50vh + 80px)" }}
      >
        {" "}
        {/* 80px is pt-20 offset */}
        <WavyTopBackground height="100%" />{" "}
        {/* Make WavyTopBackground fill this div */}
      </div>
      {/* Content for the top section (Title + Search) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(50vh - 80px)] pt-20">
        {" "}
        {/* pt-20 to push content below actual navbar */}
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-foreground">
            {t("homepage.products.allProducts")}
          </h1>

          <svg
            className="w-56 h-6 text-primary mt-3 mb-6 mx-auto"
            viewBox="0 0 192 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 6 Q 8 2, 16 6 Q 24 10, 32 6 Q 40 2, 48 6 Q 56 10, 64 6 Q 72 2, 80 6 Q 88 10, 96 6 Q 104 2, 112 6 Q 120 10, 128 6 Q 136 2, 144 6 Q 152 10, 160 6 Q 168 2, 176 6 Q 184 10, 192 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="container relative z-10 mt-36 pb-12">
        {" "}
        {/* Adjust margin-top to pull products grid up */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-12">
          {/* Main Content: Products Grid */}
          <div>
            {/* Showing X of Y results */}
            <div className="flex justify-between items-center text-foreground text-sm mb-6">
              <span className="font-bold flex items-center">
                <span className="inline-block w-[3px] h-5 bg-primary mr-1 translate-y-[2px] rounded-full" />
                {t('products.showing', {
                  start: 1,
                  end: filteredProducts.length,
                  total: filteredProducts.length
                })}
              </span>
              {/* Default sorting dropdown */}
              <div className="flex items-center gap-2">
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-[180px] bg-card border border-border rounded-md px-3 py-1 text-sm text-foreground focus:outline-none">
                    <SelectValue placeholder={t('products.sortOptions.default')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">{t('products.sortOptions.default')}</SelectItem>
                    <SelectItem value="price-asc">
                      {t('products.sortOptions.priceAsc')}
                    </SelectItem>
                    <SelectItem value="price-desc">
                      {t('products.sortOptions.priceDesc')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-[300px] bg-muted/20 rounded-2xl animate-pulse"
                    />
                  ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.documentId || product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed border-border">
                <Filter className="w-12 h-12 text-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">{t('products.noResults')}</h3>
                <p className="text-foreground">
                  {t('products.noResultsDescription')}
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              {/* Placeholder for pagination controls */}
              <nav className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-full border border-border bg-card text-foreground hover:bg-muted/50 transition-colors">
                  1
                </button>
                <button className="px-4 py-2 rounded-full border border-border bg-card text-foreground hover:bg-muted/50 transition-colors">
                  2
                </button>
                <span className="px-4 py-2 text-foreground">...</span>
                <button className="px-4 py-2 rounded-full border border-border bg-card text-foreground hover:bg-muted/50 transition-colors">
                  {t('products.pagination.last')}
                </button>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Product Categories */}
            <CategoryCard
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              productsCount={products.length}
            />
            {/* Search Box Card */}
            <SearchBoxCard
              initialQuery={searchQuery}
              onSearch={setSearchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
