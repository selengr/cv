"use client";

import Link from "next/link";
import useSWR from "swr";
import ShopShell from "@/components/shop/shopShell";
import LoadingBox from "@/components/shared/loadingBox";
import { GetShopSettingsPublic } from "@/services/settings";

export default function ShopAboutPage() {
  const { data: settings, isLoading } = useSWR(
    "shop/settings",
    GetShopSettingsPublic,
    { revalidateOnFocus: false },
  );

  return (
    <ShopShell>
      <Link href="/shop" className="text-sm text-[#1f4a45]">
        بازگشت به فروشگاه
      </Link>
      {isLoading ? (
        <div className="mt-8">
          <LoadingBox />
        </div>
      ) : (
        <article className="mx-auto mt-6 max-w-2xl">
          <h1 className="font-display text-3xl font-semibold">
            درباره {settings?.name || "فروشگاه"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#5c564d]">
            {settings?.tagline ||
              "فروشگاه کوچک با سفارش آنلاین و پنل فروشنده."}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#5c564d]">
            اینجا کاتالوگ، سبد خرید و پیگیری سفارش را یک‌جا می‌بینی. اگر سوالی
            داشتی از صفحه تماس پیام بگذار یا با شماره فروشگاه تماس بگیر.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/shop"
              className="rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
            >
              دیدن محصولات
            </Link>
            <Link
              href="/shop/contact"
              className="rounded-full px-4 py-2 text-sm ring-1 ring-[#14110e]/15"
            >
              تماس
            </Link>
          </div>
        </article>
      )}
    </ShopShell>
  );
}
