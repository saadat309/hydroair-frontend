'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/lib/stores/useLanguageStore';
import { useTranslation } from '@/lib/i18n';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const { locale } = useLanguageStore();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`http://localhost:1337/api/products?locale=${locale}&populate=*`),
          fetch(`http://localhost:1337/api/categories?locale=${locale}`)
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(prodData.data || []);
        setCategories(catData.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.id === selectedCategory)
    : products;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('nav.products')}</h1>
          <p className="text-muted-foreground">Browse our range of high-performance filters.</p>
        </div>
      </div>

      <CategoryFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelect={setSelectedCategory} 
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">{t('common.loading')}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-2xl bg-muted/20">
          <p className="text-xl text-muted-foreground">No products found in this category.</p>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="mt-4 text-primary font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
