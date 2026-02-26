"use client";

import { createContext, useContext, useMemo } from "react";

const TranslationContext = createContext(null);

export function TranslationProvider({ children, dictionary, locale }) {
  const value = useMemo(() => ({ dictionary, locale }), [dictionary, locale]);
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useDictionary must be used within a TranslationProvider");
  }
  return context;
}
