'use client';

import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function CategoryFilter({ categories, selectedCategory, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all border",
          selectedCategory === null 
            ? "bg-primary text-primary-foreground border-primary shadow-md" 
            : "bg-background text-muted-foreground hover:border-primary hover:text-primary"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
            selectedCategory === cat.id 
              ? "bg-primary text-primary-foreground border-primary shadow-md" 
              : "bg-background text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
