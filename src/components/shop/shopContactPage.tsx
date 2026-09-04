"use client";

import Link from "next/link";
import useSWR from "swr";
import ShopShell from "@/components/shop/shopShell";
import LoadingBox from "@/components/shared/loadingBox";
import { GetShopSettingsPublic } from "@/services/settings";

export default function ShopContactPage() {
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
        <article className="mx-auto mt-6 max-w-lg">
          <h1 className="font-display text-3xl font-semibold">تماس</h1>
          <p className="mt-2 text-sm text-[#5c564d]">
            برای سفارش عمده یا سوال درباره ارسال از این راه‌ها در دسترس هستیم.
          </p>
          <dl className="mt-8 space-y-4 rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm text-sm">
            {settings?.phone && (
              <div>
                <dt className="text-xs text-[#6b6459]">تلفن</dt>
                <dd className="mt-1 font-medium" dir="ltr">
                  <a href={`tel:${settings.phone}`} className="hover:underline">
                    {settings.phone}
                  </a>
                </dd>
              </div>
            )}
            {settings?.instagram && (
              <div>
                <dt className="text-xs text-[#6b6459]">اینستاگرام</dt>
                <dd className="mt-1 font-medium" dir="ltr">
                  @{settings.instagram}
                </dd>
              </div>
            )}
            {settings?.address && (
              <div>
                <dt className="text-xs text-[#6b6459]">آدرس</dt>
                <dd className="mt-1 font-medium">{settings.address}</dd>
              </div>
            )}
            {!settings?.phone && !settings?.instagram && !settings?.address && (
              <p className="text-[#6b6459]">
                هنوز اطلاعات تماس در تنظیمات فروشگاه پر نشده.
              </p>
            )}
          </dl>
          <Link
            href="/shop/track"
            className="mt-6 inline-flex rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
          >
            پیگیری سفارش
          </Link>
        </article>
      )}
    </ShopShell>
  );
}
