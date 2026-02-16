import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set) => ({
      locale: 'en',
      dir: 'ltr',
      setLocale: (locale) => set({ 
        locale, 
        dir: 'ltr' 
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);
