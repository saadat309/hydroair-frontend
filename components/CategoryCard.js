'use client';

import { useTranslation } from '@/lib/i18n';

export default function CategoryCard({
  categories,
  selectedCategory,
  onSelect,
  productsCount = 0
}) {
  const { t } = useTranslation();

  const handleCategoryClick = (slug, name) => {
    if (onSelect) {
      onSelect(slug, name);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)]">
      <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center">
        <span className="inline-block w-[3px] h-5 bg-primary mr-1 translate-y-[2px] rounded-full" />
        {t('products.categories')}
      </h3>
      <ul className="space-y-2">
        <li
          className={`text-foreground hover:text-primary transition-colors cursor-pointer ${
            selectedCategory === 'all' ? 'font-bold text-primary' : ''
          }`}
          onClick={() => handleCategoryClick('all', t('products.allProducts'))}
        >
          {t('products.allProducts')} ({productsCount})
        </li>
        {categories.map((cat) => {
          const productsCount = cat.productsCount ?? 0;
          return (
            <li
              key={cat.id}
              className={`text-foreground hover:text-primary transition-colors cursor-pointer ${
                selectedCategory === cat.slug ? 'font-bold text-primary' : ''
              }`}
              onClick={() => handleCategoryClick(cat.slug, cat.name)}
            >
              {cat.name} ({productsCount})
            </li>
          );
        })}
      </ul>
    </div>
  );
}
