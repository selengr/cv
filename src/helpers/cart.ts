import type Product from "@/models/product";

const CART_KEY = "shopy_cart";

export type CartLine = {
  productId: number;
  title: string;
  emoji?: string;
  image?: string;
  price: number;
  qty: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
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

export function addToCart(product: Product, qty = 1): CartLine[] {
  const lines = readCart();
  const existing = lines.find((line) => line.productId === product.id);
  const nextQty = (existing?.qty ?? 0) + qty;
  const stock = product.stock ?? 0;
  if (nextQty > stock) return lines;

  let next: CartLine[];
  if (existing) {
    next = lines.map((line) =>
      line.productId === product.id ? { ...line, qty: nextQty } : line,
    );
  } else {
    next = [
      ...lines,
      {
        productId: product.id,
        title: product.title,
        emoji: product.emoji,
        image: product.image,
        price: product.price,
        qty,
      },
    ];
  }
  writeCart(next);
  return next;
}

export function setCartQty(productId: number, qty: number): CartLine[] {
  const lines = readCart()
    .map((line) => (line.productId === productId ? { ...line, qty } : line))
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
