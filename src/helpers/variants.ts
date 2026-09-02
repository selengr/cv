import type Product from "@/models/product";
import type { ProductVariant } from "@/models/product";

export function hasVariants(product: Product) {
  return (product.variants?.length ?? 0) > 0;
}

export function productStock(product: Product) {
  if (hasVariants(product)) {
    return product.variants!.reduce((sum, item) => sum + (item.stock ?? 0), 0);
  }
  return product.stock ?? 0;
}

export function variantLabel(variant: Pick<ProductVariant, "size" | "color">) {
  const parts = [variant.size, variant.color].filter(Boolean);
  return parts.join(" / ");
}

export function uniqueOptionValues(
  variants: ProductVariant[],
  key: "size" | "color",
) {
  const values: string[] = [];
  for (const variant of variants) {
    const value = variant[key]?.trim();
    if (value && !values.includes(value)) values.push(value);
  }
  return values;
}

export function findVariant(
  product: Product,
  selection: { size?: string; color?: string; variantId?: number },
) {
  const variants = product.variants ?? [];
  if (selection.variantId != null) {
    return variants.find((item) => item.id === selection.variantId);
  }
  return variants.find((item) => {
    const sizeOk = selection.size
      ? item.size === selection.size
      : !item.size || uniqueOptionValues(variants, "size").length === 0;
    const colorOk = selection.color
      ? item.color === selection.color
      : !item.color || uniqueOptionValues(variants, "color").length === 0;
    return sizeOk && colorOk;
  });
}

export function variantUnitPrice(product: Product, variant?: ProductVariant) {
  return variant?.price ?? product.price;
}

export function normalizeVariants(
  raw: unknown,
): ProductVariant[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const variants: ProductVariant[] = [];
  let next = 1;
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const size = String(item.size ?? "").trim() || undefined;
    const color = String(item.color ?? "").trim() || undefined;
    if (!size && !color) continue;
    const stock = Number(item.stock ?? 0);
    const priceRaw = item.price;
    const price =
      priceRaw === "" || priceRaw == null || priceRaw === undefined
        ? undefined
        : Number(priceRaw);
    const id = Number(item.id);
    variants.push({
      id: Number.isFinite(id) && id > 0 ? id : next++,
      size,
      color,
      stock: Number.isFinite(stock) && stock >= 0 ? stock : 0,
      price: price != null && Number.isFinite(price) && price >= 0 ? price : undefined,
    });
  }
  if (variants.length === 0) return undefined;
  const maxId = variants.reduce((max, item) => Math.max(max, item.id), 0);
  let cursor = maxId + 1;
  const seen = new Set<number>();
  return variants.map((item) => {
    if (seen.has(item.id)) {
      return { ...item, id: cursor++ };
    }
    seen.add(item.id);
    return item;
  });
}
