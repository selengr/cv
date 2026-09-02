import type Product from "@/models/product";
import type { ProductVariant } from "@/models/product";
import {
  hasVariants,
  productStock,
  variantLabel,
  variantUnitPrice,
} from "@/helpers/variants";

const CART_KEY = "shopy_cart";

export type CartLine = {
  productId: number;
  variantId?: number;
  size?: string;
  color?: string;
  title: string;
  emoji?: string;
  image?: string;
  price: number;
  qty: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function lineKey(productId: number, variantId?: number) {
  return `${productId}:${variantId ?? "base"}`;
}

export function readCart(): CartLine[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("shopy-cart"));
}

export function clearCart() {
  if (!canUseStorage()) return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("shopy-cart"));
}

export function subscribeCart(onStoreChange: () => void) {
  if (!canUseStorage()) return () => undefined;
  window.addEventListener("shopy-cart", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("shopy-cart", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function addToCart(
  product: Product,
  qty = 1,
  variant?: ProductVariant,
): CartLine[] {
  const lines = readCart();
  if (hasVariants(product) && !variant) return lines;

  const stock = variant ? variant.stock : productStock(product);
  const existing = lines.find(
    (line) =>
      lineKey(line.productId, line.variantId) ===
      lineKey(product.id, variant?.id),
  );
  const nextQty = (existing?.qty ?? 0) + qty;
  if (nextQty > stock) return lines;

  const label = variant ? variantLabel(variant) : "";
  const title = label ? `${product.title} (${label})` : product.title;
  const price = variantUnitPrice(product, variant);

  let next: CartLine[];
  if (existing) {
    next = lines.map((line) =>
      lineKey(line.productId, line.variantId) ===
      lineKey(product.id, variant?.id)
        ? { ...line, qty: nextQty, price, title }
        : line,
    );
  } else {
    next = [
      ...lines,
      {
        productId: product.id,
        variantId: variant?.id,
        size: variant?.size,
        color: variant?.color,
        title,
        emoji: product.emoji,
        image: product.image,
        price,
        qty,
      },
    ];
  }
  writeCart(next);
  return next;
}

export function setCartQty(
  productId: number,
  qty: number,
  variantId?: number,
): CartLine[] {
  const lines = readCart()
    .map((line) =>
      lineKey(line.productId, line.variantId) === lineKey(productId, variantId)
        ? { ...line, qty }
        : line,
    )
    .filter((line) => line.qty > 0);
  writeCart(lines);
  return lines;
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}
