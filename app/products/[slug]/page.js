'use client';

import { useState, useEffect, use } from 'react';
import { useLanguageStore } from '@/lib/stores/useLanguageStore';
import { useTranslation } from '@/lib/i18n';
import { Loader2, ArrowLeft, CheckCircle2, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const { locale } = useLanguageStore();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:1337/api/products?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setProduct(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to products
        </Link>
      </div>
    );
  }

  const imageUrl = product.image?.url ? `http://localhost:1337${product.image.url}` : '/placeholder-product.svg';

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t('nav.products')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border shadow-sm">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            {product.category && (
              <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-2 block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.inStock ? (
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> IN STOCK
                </span>
              ) : (
                <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full font-bold">
                  OUT OF STOCK
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-lg">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.addFeatures && Array.isArray(product.addFeatures) && product.addFeatures.length > 0 ? (
                product.addFeatures.map((item, i) => (
                  <li key={item.id || i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item.Feature}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-sm italic">Detailed features list coming soon.</li>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t">
            <button 
              className="flex-grow bg-primary text-primary-foreground h-14 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-5 h-5" />
              {t('common.addToCart')}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-dashed">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Certified Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mt-20 pt-12 border-t">
          <h2 className="text-3xl font-bold mb-6">Detailed Description</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <BlocksRenderer content={product.description} />
          </div>
        </div>
      )}
    </div>
  );
}
