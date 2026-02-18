import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'en',
      dir: 'ltr',
      setLanguage: (language) => set({ 
        language, 
        dir: 'ltr' 
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);
