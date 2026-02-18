"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/stores/useLanguageStore";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import { Search, Filter, ShoppingCart } from "lucide-react";
import useCartStore from "@/lib/stores/useCartStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { addItem } = useCartStore();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        try {
            // Fetch Categories
            const categoriesRes = await fetchAPI("/categories", { locale: language });
            setCategories(categoriesRes.data || []);

            // Fetch Products
            const query = {
                locale: language,
            };
            
            // If filtering by category (we do it client side or explicit query? simpler to fetch all for now or filter)
            // Ideally backend filtering is better: filters[category][slug][$eq]=...
            // But let's fetch all and filter client side for better UX with small dataset, or use backend params if we want scalable.
            // Let's use backend filtering if selectedCategory !== 'all'.
            
            if (selectedCategory !== "all") {
                // Strapi filter syntax: filters[category][slug][$eq]=categorySlug
                // My simple API helper might handle this if I construct the key manually.
                query["filters[category][slug][$eq]"] = selectedCategory;
            }

            const productsRes = await fetchAPI("/products", query);
            setProducts(productsRes.data || []);

        } catch (error) {
            console.error("Failed to load products page data:", error);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, [language, selectedCategory]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem({
      id: product.id || product.documentId,
      name: product.name,
      price: product.price,
      image: getStrapiMedia(product.image?.url)
    });
    toast.success(t('cart.added'));
  };

  // Client-side search filtering
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-transparent">
        <div className="container">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                        {t('homepage.products.allProducts')}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        {t('homepage.products.subtitle')}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
                {/* Search */}
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                            selectedCategory === "all" 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-card text-foreground border-border hover:border-primary/50"
                        }`}
                    >
                        All Products
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                                selectedCategory === cat.slug
                                    ? "bg-primary text-primary-foreground border-primary" 
                                    : "bg-card text-foreground border-border hover:border-primary/50"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="h-[300px] bg-muted/20 rounded-2xl animate-pulse" />
                    ))}
                 </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => {
                        const imageUrl = getStrapiMedia(product.image?.url);
                        return (
                            <Link 
                                key={product.documentId || product.id} 
                                href={`/products/${product.slug}`}
                                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="aspect-square bg-secondary/10 relative overflow-hidden p-6 flex items-center justify-center">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground text-xs">No Image</div>
                                    )}
                                    
                                    <button 
                                        onClick={(e) => handleAddToCart(e, { id: product.documentId || product.id, attributes: product })} 
                                        className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-primary translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="text-sm text-muted-foreground mb-1">
                                        {product.category?.name || "Uncategorized"}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-xl">${product.price}</span>
                                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                            In Stock
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-muted/10 rounded-3xl border border-dashed border-border">
                    <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">No products found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    </div>
  );
}
