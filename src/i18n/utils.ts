import { ui, defaultLang } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    
    // Se la lingua di destinazione è quella di default, non aggiungiamo il prefisso
    if (l === defaultLang) {
      return cleanPath;
    }
    
    // Altrimenti aggiungiamo il prefisso della lingua
    return `/${l}${cleanPath === "/" ? "" : cleanPath}`;
  };
}
