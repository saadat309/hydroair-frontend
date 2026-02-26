"use client";

import { useDictionary } from './TranslationProvider';

export const useTranslation = () => {
  const { dictionary, locale } = useDictionary();
  
  const t = (path, params = {}) => {
    if (!dictionary) return path;

    const keys = path.split('.');
    let result = dictionary;
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      return result.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
    }
    
    return result;
  };

  return { t, locale };
};
