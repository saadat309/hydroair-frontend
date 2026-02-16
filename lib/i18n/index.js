import en from './dictionaries/en.json';
import ru from './dictionaries/ru.json';
import uz from './dictionaries/uz.json';
import { useLanguageStore } from '../stores/useLanguageStore';

const dictionaries = { en, ru, uz };

export const useTranslation = () => {
  const { locale } = useLanguageStore();
  
  const t = (path) => {
    const keys = path.split('.');
    let result = dictionaries[locale];
    
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    
    return result;
  };

  return { t, locale };
};
