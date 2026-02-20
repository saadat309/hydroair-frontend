import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';
import uz from './dictionaries/uz.json';
import { useLanguageStore } from '../stores/useLanguageStore';

const dictionaries = { en, ru, uz };

export const useTranslation = () => {
  const { language: locale } = useLanguageStore();
  
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let result = dictionaries[locale];
    
    for (const key of keys) {
      if (result[key]) {
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
