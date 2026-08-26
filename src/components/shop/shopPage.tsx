"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import ShopShell from "@/components/shop/shopShell";
import ProductThumb from "@/components/shared/productThumb";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import { GetShopProducts, CreateShopOrder } from "@/services/shop";
import { CATEGORIES, categoryLabel, formatToman } from "@/helpers/catalog";
import {
  addToCart,
  cartCount,
  cartTotal,
  clearCart,
  readCart,
  setCartQty,
  subscribeCart,
} from "@/helpers/cart";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";
import ValidationError from "@/exceptions/validationError";
import type Product from "@/models/product";

export default function ShopPage() {
  const { data, error, mutate } = useSWR("shop/products", GetShopProducts);
  const lines = useSyncExternalStore(subscribeCart, readCart, () => []);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [placedId, setPlacedId] = useState<number | null>(null);

  const loading = !data && !error;
  const filtered = useMemo(() => {
    const products = data ?? [];
    return category
      ? products.filter((item) => item.category === category)
      : products;
  }, [category, data]);

  const onAdd = (product: Product) => {
    const before = lines.find((line) => line.productId === product.id)?.qty ?? 0;
    const next = addToCart(product);
    const after = next.find((line) => line.productId === product.id)?.qty ?? 0;
    if (after === before) {
      toast.error("موجودی این محصول تمام است");
      return;
    }
    toast.success(`${product.title} به سبد اضافه شد`);
  };

  const checkout = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = normalizeIranianPhone(phone);
    if (name.trim().length < 2) {
      toast.error("نام را بنویس");
      return;
    }
    if (!iranianPhoneRegExp.test(normalized)) {
      toast.error("شماره موبایل درست نیست");
      return;
    }
    if (lines.length === 0) {
      toast.error("سبد خالی است");
      return;
    }

    setSaving(true);
    try {
      const order = await CreateShopOrder({
        customerName: name.trim(),
        customerPhone: normalized,
        items: lines.map((line) => ({
          productId: line.productId,
          qty: line.qty,
        })),
      });
      clearCart();
      setPlacedId(order.id);
      await mutate();
      toast.success("سفارش ثبت شد");
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "سفارش ثبت نشد"));
        return;
      }
      toast.error("سفارش ثبت نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ShopShell cartCount={cartCount(lines)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">فروشگاه</h1>
          <p className="mt-2 text-sm text-[#5c564d]">
            بدون ورود هم می‌شود خرید کرد. سفارش می‌رود داخل پنل فروشنده.
          </p>
        </div>
      </div>

      {placedId && (
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          سفارش #{placedId.toLocaleString("fa-IR")} ثبت شد. فروشنده در پنل می‌بیندش.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`rounded-full px-3 py-1.5 text-sm ${
            category === "" ? "bg-[#1f4a45] text-white" : "bg-white"
          }`}
        >
          همه
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setCategory(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              category === item.value ? "bg-[#1f4a45] text-white" : "bg-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          {loading ? (
            <LoadingBox />
          ) : filtered.length === 0 ? (
            <EmptyList title="محصولی نیست" description="این دسته خالی است" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((product) => {
                const stock = product.stock ?? 0;
                return (
                  <article
                    key={product.id}
                    className="flex flex-col rounded-3xl border border-[#14110e]/8 bg-white/85 p-4 shadow-sm"
                  >
                    <ProductThumb item={product} className="h-40" />
                    <p className="mt-3 text-xs text-[#1f4a45]">
                      {categoryLabel(product.category)}
                    </p>
                    <h2 className="font-display mt-1 text-lg font-semibold">
                      {product.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-[#6b6459]">
                      {product.body}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <p className="text-sm font-medium">{formatToman(product.price)}</p>
                      <span className="text-xs text-[#6b6459]">
                        {stock.toLocaleString("fa-IR")} عدد
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={stock < 1}
                      onClick={() => onAdd(product)}
                      className="mt-3 rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white disabled:opacity-40"
                    >
                      {stock < 1 ? "ناموجود" : "افزودن به سبد"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">سبد خرید</h2>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-[#6b6459]">هنوز چیزی برنداشتی.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lines.map((line) => (
                <li key={line.productId} className="flex items-center gap-3">
                  <span className="inline-block w-12 shrink-0">
                    <ProductThumb item={line} className="h-12" compact />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.title}</p>
                    <p className="text-xs text-[#6b6459]">{formatToman(line.price)}</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={line.qty}
                    onChange={(event) =>
                      setCartQty(line.productId, Number(event.target.value) || 0)
                    }
                    className="w-14 rounded-xl border border-[#14110e]/10 px-2 py-1 text-sm"
                  />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 font-medium">{formatToman(cartTotal(lines))}</p>

          <form onSubmit={checkout} className="mt-4 space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="نام"
              className="w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="موبایل"
              inputMode="tel"
              dir="ltr"
              className="w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={saving || lines.length === 0}
              className="w-full rounded-full bg-[#1f4a45] px-4 py-2.5 text-sm text-white disabled:opacity-50"
            >
              {saving ? "در حال ثبت..." : "ثبت سفارش"}
            </button>
          </form>
        </aside>
      </div>
    </ShopShell>
  );
}
