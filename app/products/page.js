"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import { Filter, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";
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

const PAGE_SIZE = 9;

export default function ProductsPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();
  
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSort, setSelectedSort] = useState("default");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [displayedCount, setDisplayedCount] = useState(0);

  const totalPages = Math.ceil(displayedCount / PAGE_SIZE);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const categoriesRes = await fetchAPI("/categories", { 
          locale: language,
          fields: ['name', 'slug'],
        });
        
        const categoriesWithCounts = await Promise.all(
          (categoriesRes.data || []).map(async (cat) => {
            const countRes = await fetchAPI("/products", {
              locale: language,
              'filters[category][slug][$eq]': cat.slug,
              pagination: { page: 1, pageSize: 1 },
            });
            return {
              ...cat,
              productsCount: countRes.meta?.pagination?.total || 0
            };
          })
        );
        setCategories(categoriesWithCounts);

        const allProductsRes = await fetchAPI("/products", { 
          locale: language,
          pagination: { page: 1, pageSize: 1 },
        });
        setTotalProducts(allProductsRes.meta?.pagination?.total || 0);

        const productFilters = {
          locale: language,
          pagination: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        };

        if (searchQuery) {
          productFilters["filters[$or][0][name][$containsi]"] = searchQuery;
          productFilters["filters[$or][1][description][$containsi]"] = searchQuery;
        } else if (selectedCategory !== "all") {
          productFilters["filters[category][slug][$eq]"] = selectedCategory;
        }

        if (selectedSort === "price-asc") {
          productFilters.sort = ["price:asc"];
        } else if (selectedSort === "price-desc") {
          productFilters.sort = ["price:desc"];
        }

        const productsRes = await fetchAPI("/products", productFilters);
        setProducts(productsRes.data || []);
        setDisplayedCount(productsRes.meta?.pagination?.total || 0);

      } catch (error) {
        console.error("Failed to fetch products or categories:", error);
        toast.error("Error loading products or categories.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [language, selectedCategory, currentPage, selectedSort, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (slug, name = "") => {
    setSelectedCategory(slug);
    setSelectedCategoryName(name || "");
  };

  const getPageTitle = () => {
    if (selectedCategory !== "all" && selectedCategoryName) {
      return selectedCategoryName;
    }
    return t("homepage.products.allProducts");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCategoryName("");
    setSearchQuery("");
    setSelectedSort("default");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== "all" || searchQuery || selectedSort !== "default";

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
            {getPageTitle()}
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
                  start: displayedCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0,
                  end: Math.min(currentPage * PAGE_SIZE, displayedCount),
                  total: displayedCount
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
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-sm text-primary hover:text-primary/80 transition-colors bg-secondary rounded-xl hover:bg-secondary/80 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    {t('products.clearFilters')}
                  </button>
                )}
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
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
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
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-border bg-card text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-2 text-foreground">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border bg-card text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-border bg-card text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Product Categories */}
            <CategoryCard
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
              productsCount={totalProducts}
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
