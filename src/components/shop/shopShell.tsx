"use client";

import Link from "next/link";
import Logo from "@/components/landing/logo";

export default function ShopShell({
  children,
  cartCount = 0,
}: {
  children: React.ReactNode;
  cartCount?: number;
}) {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#14110e]">
      <header className="sticky top-0 z-20 border-b border-[#14110e]/8 bg-[#f4efe6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo />
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-white">
              فروشگاه
              {cartCount > 0 && (
                <span className="mr-1.5 rounded-full bg-white/20 px-1.5">
                  {cartCount.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>
            <Link href="/panel" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              پنل
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
