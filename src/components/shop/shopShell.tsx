"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import Logo from "@/components/landing/logo";
import {
  readLocale,
  subscribeLocale,
  writeLocale,
  type ShopLocale,
} from "@/helpers/locale";

export default function ShopShell({
  children,
  cartCount = 0,
  wishCount = 0,
}: {
  children: React.ReactNode;
  cartCount?: number;
  wishCount?: number;
}) {
  const locale = useSyncExternalStore(subscribeLocale, readLocale, () => "fa" as ShopLocale);
  const fa = locale === "fa";

  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#14110e]" dir={fa ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-20 border-b border-[#14110e]/8 bg-[#f4efe6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo />
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-white">
              {fa ? "فروشگاه" : "Shop"}
              {cartCount > 0 && (
                <span className="mx-1.5 rounded-full bg-white/20 px-1.5">
                  {cartCount.toLocaleString(fa ? "fa-IR" : "en-US")}
                </span>
              )}
            </Link>
            <Link href="/shop/wishlist" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              {fa ? "علاقه‌مندی" : "Wishlist"}
              {wishCount > 0 && (
                <span className="mx-1.5 text-[#1f4a45]">
                  {wishCount.toLocaleString(fa ? "fa-IR" : "en-US")}
                </span>
              )}
            </Link>
            <Link href="/shop/track" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              {fa ? "پیگیری" : "Track"}
            </Link>
            <Link href="/shop/account" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              {fa ? "حساب" : "Account"}
            </Link>
            <Link href="/panel" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              {fa ? "پنل" : "Panel"}
            </Link>
            <button
              type="button"
              onClick={() => writeLocale(fa ? "en" : "fa")}
              className="rounded-full px-3 py-1.5 ring-1 ring-[#14110e]/15"
              aria-label="Toggle language"
            >
              {fa ? "EN" : "FA"}
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
