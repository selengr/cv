import { categoryLabel } from "@/helpers/catalog";
import type Product from "@/models/product";

export function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/\s+/g, " ");
}

export function productMatchesQuery(product: Product, query: string) {
  const needle = normalizeSearch(query);
  if (!needle) return true;

  const haystack = normalizeSearch(
    [
      product.title,
      product.title_en ?? "",
      product.body,
      product.body_en ?? "",
      categoryLabel(product.category),
      product.emoji ?? "",
    ].join(" "),
  );

  return haystack.includes(needle);
}
