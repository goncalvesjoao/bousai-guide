import { ui, defaultLang, showDefaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (Object.hasOwn(ui, lang)) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  const localizedUI: Partial<Record<keyof typeof ui[typeof defaultLang], string>> = ui[lang];
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return localizedUI[key] ?? ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, language: keyof typeof ui = lang) {
    return !showDefaultLang && language === defaultLang ? path : `/${language}${path}`;
  };
}
