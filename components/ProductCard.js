'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  
  // Handle Strapi v5 data structure (often just the object itself or nested in attributes)
  const { name, price, shortDescription, slug, image, inStock } = product;
  const imageUrl = image?.url ? `http://localhost:1337${image.url}` : '/placeholder-product.svg';

  return (
    <div className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-background flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {!inStock && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] px-2 py-1 rounded font-bold uppercase">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {shortDescription}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <span className="text-xl font-bold text-primary">${price}</span>
          <div className="flex gap-2">
            <Link 
              href={`/products/${slug}`}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title={t('common.viewMore')}
            >
              <Eye className="w-5 h-5" />
            </Link>
            <button 
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              disabled={!inStock}
              title={t('common.addToCart')}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
