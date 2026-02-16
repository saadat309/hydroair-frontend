'use client';

import { useLanguageStore } from '@/lib/stores/useLanguageStore';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-full border">
      <button
        onClick={() => setLocale('en')}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-all",
          locale === 'en' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ru')}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-all",
          locale === 'ru' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
      >
        RU
      </button>
      <button
        onClick={() => setLocale('uz')}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-all",
          locale === 'uz' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
      >
        UZ
      </button>
    </div>
  );
}
