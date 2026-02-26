"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronLeft, ChevronRight, X, Search, SlidersHorizontal } from "lucide-react";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import SearchBoxCard from "@/components/SearchBoxCard";
import CategoryCard from "@/components/CategoryCard";
import TagFilter from "@/components/TagFilter";
import PageHeader from '@/components/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PAGE_SIZE = 6;

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();
  const { addItem } = useCartStore();
  
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "all");
    const [selectedTagName, setSelectedTagName] = useState("");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");
    const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "default");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [displayedCount, setDisplayedCount] = useState(0);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const totalPages = Math.ceil(displayedCount / PAGE_SIZE);

  // Debounce mobile search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        handleSearch(localSearch);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch]);

  // Sync local search when searchQuery changes from other sources (e.g. clear filters)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim() !== "") {
      params.set("search", query);
      params.delete("category");
      params.delete("tag");
      params.delete("page");
    } else {
      params.delete("search");
    }
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });
    
    setSearchQuery(query);
    if (query.trim() !== "") {
      setSelectedCategory("all");
      setSelectedCategoryName("");
      setSelectedTag("all");
      setSelectedTagName("");
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetchAPI("/categories", { 
            locale,
            fields: ['name', 'slug'],
          }),
          fetchAPI("/tags", {
            locale,
            fields: ['name', 'slug'],
          })
        ]);
        
        const categoriesWithCounts = await Promise.all(
          (categoriesRes.data || []).map(async (cat) => {
            const countRes = await fetchAPI("/products", {
              locale,
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
        setTags(tagsRes.data || []);

        // Resolve names from slugs if present in URL
        if (selectedCategory !== "all") {
          const cat = categoriesWithCounts.find(c => c.slug === selectedCategory);
          if (cat) setSelectedCategoryName(cat.name);
        }
        if (selectedTag !== "all") {
          const tag = (tagsRes.data || []).find(t => t.slug === selectedTag);
          if (tag) setSelectedTagName(tag.name);
        }

        const allProductsRes = await fetchAPI("/products", { 
          locale,
          pagination: { page: 1, pageSize: 1 },
        });
        setTotalProducts(allProductsRes.meta?.pagination?.total || 0);

        const productFilters = {
          locale,
          pagination: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        };

        // If searching, only apply search filters (Global search)
        if (searchQuery) {
          productFilters["filters[$or][0][name][$containsi]"] = searchQuery;
          productFilters["filters[$or][1][description][$containsi]"] = searchQuery;
        } else {
          // Otherwise apply category and tag filters
          if (selectedCategory !== "all") {
            productFilters["filters[category][slug][$eq]"] = selectedCategory;
          }

          if (selectedTag !== "all") {
            productFilters["filters[tags][slug][$eq]"] = selectedTag;
          }
        }

        if (selectedSort === "price-asc") {
          productFilters.sort = ["price:asc"];
        } else if (selectedSort === "price-desc") {
          productFilters.sort = ["price:desc"];
        } else {
          // Default: Newest first
          productFilters.sort = ["createdAt:desc"];
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
  }, [locale, selectedCategory, selectedTag, currentPage, selectedSort, searchQuery]);

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const tag = searchParams.get("tag") || "all";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "default";
    const page = Number(searchParams.get("page")) || 1;

    setSelectedCategory(category);
    setSelectedTag(tag);
    setSearchQuery(search);
    setSelectedSort(sort);
    setCurrentPage(page);
  }, [searchParams]);

  const handleCategorySelect = (slug, name = "") => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    params.delete("tag");
    params.delete("search");
    params.delete("page");
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });

    setSelectedCategory(slug);
    setSelectedCategoryName(name || "");
    setSelectedTag("all");
    setSelectedTagName("");
    setSearchQuery("");
    setLocalSearch("");
    setIsFilterSheetOpen(false);
  };

  const handleTagSelect = (slug, name = "") => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("tag");
    else params.set("tag", slug);
    params.delete("category");
    params.delete("search");
    params.delete("page");
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });

    setSelectedTag(slug);
    setSelectedTagName(name || "");
    setSelectedCategory("all");
    setSelectedCategoryName("");
    setSearchQuery("");
    setLocalSearch("");
    setIsFilterSheetOpen(false);
  };

  const getPageTitle = () => {
    if (selectedTag !== "all" && selectedTagName) {
      return `TAG: ${selectedTagName.toUpperCase()}`;
    }
    if (selectedCategory !== "all" && selectedCategoryName) {
      return selectedCategoryName;
    }
    return t("homepage.products.allProducts");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) params.delete("page");
      else params.set("page", page);
      router.push(`/${locale}/products?${params.toString()}`, { scroll: true });
      
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    router.push(`/${locale}/products`);
    setSelectedCategory("all");
    setSelectedCategoryName("");
    setSelectedTag("all");
    setSelectedTagName("");
    setSearchQuery("");
    setLocalSearch("");
    setSelectedSort("default");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedTag !== "all" || searchQuery || selectedSort !== "default";

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "default") params.delete("sort");
    else params.set("sort", value);
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });
    setSelectedSort(value);
  };

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

  const SidebarContent = () => (
    <>
      {/* Product Categories */}
      <CategoryCard
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
        productsCount={totalProducts}
      />
      {/* Product Tags */}
      <TagFilter
        tags={tags}
        selectedTag={selectedTag}
        onSelect={handleTagSelect}
      />
    </>
  );

  return (
    <div className="pb-20">
      <PageHeader title={getPageTitle()} isProductsPage={true}>
        <div className="max-w-md mx-auto relative px-4 flex flex-col gap-4">
          {/* Mobile-only debounced search */}
          <div className="md:hidden relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={t("products.searchPlaceholder")}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base shadow-lg"
            />
          </div>

          {/* Mobile-only filter controls */}
          <div className="md:hidden flex items-center justify-center gap-2">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full w-14 h-14 bg-background border-border shadow-md flex items-center justify-center">
                  <Filter className="w-6 h-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto px-0">
                <SheetHeader className="mb-6 px-6">
                  <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    {t('common.filter') || 'Filters'}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8 pb-10 px-6">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>

            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="rounded-full h-14 px-6 bg-background border-border text-primary font-bold shadow-md flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                {t('products.clearFilters')}
              </Button>
            )}
          </div>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 md:-mt-10">
        {" "}
        {/* Adjust margin-top to pull products grid up */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12">
          {/* Sidebar - Hidden on Mobile, Shown on Desktop */}
          <div className="hidden md:flex order-1 md:order-2 flex-col gap-8">
            <SearchBoxCard
              initialQuery={searchQuery}
              onSearch={handleSearch}
            />
            <SidebarContent />
          </div>

          {/* Main Content: Products Grid - Bottom on Mobile, Left on Desktop */}
          <div className="order-2 md:order-1">
            {/* Showing X of Y results */}
            <div className="flex justify-between items-center text-foreground text-sm mb-6">
              <span className="font-bold flex items-center">
                <span className="inline-block w-[3px] h-5 bg-primary mr-1 translate-y-[2px] rounded-full" />
                {t("products.showing", {
                  start:
                    displayedCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0,
                  end: Math.min(currentPage * PAGE_SIZE, displayedCount),
                  total: displayedCount,
                })}
              </span>
              {/* Default sorting dropdown */}
              <div className="flex items-center gap-2">
                <Select value={selectedSort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] bg-card border border-border rounded-md px-3 py-1 text-sm text-foreground focus:outline-none">
                    <SelectValue
                      placeholder={t("products.sortOptions.default")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      {t("products.sortOptions.default")}
                    </SelectItem>
                    <SelectItem value="price-asc">
                      {t("products.sortOptions.priceAsc")}
                    </SelectItem>
                    <SelectItem value="price-desc">
                      {t("products.sortOptions.priceDesc")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {/* Desktop-only clear filters button */}
                <div className="hidden md:block">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 text-sm text-primary hover:text-primary/80 transition-colors bg-secondary rounded-xl hover:bg-secondary/80 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      {t("products.clearFilters")}
                    </button>
                  )}
                </div>
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
                <h3 className="text-xl font-bold mb-2">
                  {t("products.noResults")}
                </h3>
                <p className="text-foreground">
                  {t("products.noResultsDescription")}
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

                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-2 text-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border bg-card text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

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
        </div>
      </div>
    </div>
  );
}
