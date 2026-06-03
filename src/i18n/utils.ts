import { ui, defaultLang, routes } from "./ui";

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

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);
  
  const currentLang = parts[0] in ui ? (parts[0] as keyof typeof ui) : defaultLang;
  const pathParts = parts[0] in ui ? parts.slice(1) : parts;
  const currentPath = pathParts.join("/");
  
  if (!currentPath) return "";

  // Trova la chiave del percorso invertendo il dizionario per la lingua corrente
  const currentRoutes = routes[currentLang];
  for (const [key, value] of Object.entries(currentRoutes)) {
    if (value === currentPath) {
      return key;
    }
  }
  
  return currentPath;
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const cleanPath = path.replace(/^\/|\/$/g, "");
    
    // Castiamo a Record<string, string> per consentire l'indicizzazione dinamica con stringhe
    const currentLangRoutes = routes[l as keyof typeof routes] as Record<string, string>;
    const hasTranslation = cleanPath in currentLangRoutes;
    const translatedSegment = hasTranslation 
      ? currentLangRoutes[cleanPath] 
      : cleanPath;

    const prefix = l === defaultLang ? "" : `/${l}`;
    return `${prefix}/${translatedSegment}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  };
}
