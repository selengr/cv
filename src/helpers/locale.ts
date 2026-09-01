export type ShopLocale = "fa" | "en";

const LOCALE_KEY = "shopy_locale";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readLocale(): ShopLocale {
  if (!canUseStorage()) return "fa";
  const raw = localStorage.getItem(LOCALE_KEY);
  return raw === "en" ? "en" : "fa";
}

export function writeLocale(locale: ShopLocale) {
  if (!canUseStorage()) return;
  localStorage.setItem(LOCALE_KEY, locale);
  window.dispatchEvent(new Event("shopy-locale"));
}

export function subscribeLocale(onStoreChange: () => void) {
  if (!canUseStorage()) return () => undefined;
  window.addEventListener("shopy-locale", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("shopy-locale", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function localizedTitle(
  product: { title: string; title_en?: string },
  locale: ShopLocale,
) {
  if (locale === "en" && product.title_en?.trim()) return product.title_en;
  return product.title;
}

export function localizedBody(
  product: { body: string; body_en?: string },
  locale: ShopLocale,
) {
  if (locale === "en" && product.body_en?.trim()) return product.body_en;
  return product.body;
}
