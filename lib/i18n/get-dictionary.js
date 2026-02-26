import 'server-only';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  uz: () => import('./dictionaries/uz.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  return (dictionaries[locale] || dictionaries.en)();
};
