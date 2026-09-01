import type Product from "@/models/product";

const WISHLIST_KEY = "shopy_wishlist";

export type WishlistItem = {
  productId: number;
  title: string;
  emoji?: string;
  image?: string;
  price: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readWishlist(): WishlistItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistItem[];
  } catch {
    return [];
  }
}

export function writeWishlist(items: WishlistItem[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("shopy-wishlist"));
}

export function subscribeWishlist(onStoreChange: () => void) {
  if (!canUseStorage()) return () => undefined;
  window.addEventListener("shopy-wishlist", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("shopy-wishlist", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function isInWishlist(productId: number, items = readWishlist()) {
  return items.some((item) => item.productId === productId);
}

export function toggleWishlist(product: Product): WishlistItem[] {
  const items = readWishlist();
  const exists = items.some((item) => item.productId === product.id);
  const next = exists
    ? items.filter((item) => item.productId !== product.id)
    : [
        ...items,
        {
          productId: product.id,
          title: product.title,
          emoji: product.emoji,
          image: product.image,
          price: product.price,
        },
      ];
  writeWishlist(next);
  return next;
}

export function removeFromWishlist(productId: number): WishlistItem[] {
  const next = readWishlist().filter((item) => item.productId !== productId);
  writeWishlist(next);
  return next;
}

export function wishlistCount(items: WishlistItem[]) {
  return items.length;
}
