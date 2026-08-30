"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";
import ShopShell from "@/components/shop/shopShell";
import LoadingBox from "@/components/shared/loadingBox";
import ProductThumb from "@/components/shared/productThumb";
import { GetShopOrder, RequestShopPayment } from "@/services/payment";
import { formatToman } from "@/helpers/catalog";
import { formatDay, statusLabel } from "@/helpers/orders";
import ValidationError from "@/exceptions/validationError";

export default function ShopPayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    { url: `/shop/pay/${orderId}`, orderId: Number(orderId) },
    ({ orderId: id }) => GetShopOrder(id),
  );
  const [saving, setSaving] = useState(false);
  const order = data?.order;

  const goGateway = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const payment = await RequestShopPayment(order.id);
      router.push(payment.redirectUrl);
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "درگاه باز نشد"));
        return;
      }
      toast.error("درگاه باز نشد");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ShopShell>
        <LoadingBox />
      </ShopShell>
    );
  }

  if (error || !order) {
    return (
      <ShopShell>
        <p className="text-sm text-[#6b6459]">این سفارش پیدا نشد.</p>
        <button
          type="button"
          onClick={() => router.replace("/shop")}
          className="mt-3 text-sm text-[#1f4a45]"
        >
          برگشت به فروشگاه
        </button>
      </ShopShell>
    );
  }

  const alreadyPaid = order.status !== "pending";

  return (
    <ShopShell>
      <Link href="/shop" className="text-sm text-[#1f4a45]">
        بازگشت به فروشگاه
      </Link>
      <h1 className="font-display mt-3 text-3xl font-semibold">
        پرداخت سفارش #{order.id.toLocaleString("fa-IR")}
      </h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        {formatDay(order.created_at)} · {statusLabel(order.status)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm">
          <h2 className="font-display text-lg font-semibold">اقلام</h2>
          <ul className="mt-3 divide-y divide-[#14110e]/8">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.title}`}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-block w-12 shrink-0">
                    <ProductThumb item={item} className="h-12" compact />
                  </span>
                  <span>
                    {item.title}
                    <span className="mr-2 text-xs text-[#6b6459]">
                      × {item.qty.toLocaleString("fa-IR")}
                    </span>
                  </span>
                </span>
                <span className="text-sm">{formatToman(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-left font-display text-xl font-semibold">
            {formatToman(order.total)}
          </p>
        </div>

        <div className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm">
          {alreadyPaid ? (
            <div>
              <h2 className="font-display text-lg font-semibold text-emerald-800">
                پرداخت شد
              </h2>
              <p className="mt-2 text-sm text-[#5c564d]">
                این سفارش دیگر نیازی به پرداخت ندارد.
                {order.refId
                  ? ` کد پیگیری درگاه: ${order.refId}`
                  : " فروشنده در پنل می‌بیندش."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/shop/track"
                  className="inline-flex rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
                >
                  پیگیری سفارش
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex rounded-full px-4 py-2 text-sm ring-1 ring-[#14110e]/15"
                >
                  ادامه خرید
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-lg font-semibold">درگاه آنلاین</h2>
              <p className="mt-2 text-sm text-[#5c564d]">
                مثل زرین‌پال: اول درخواست، بعد صفحه بانک آزمایشی، بعد تایید
                پرداخت. پول واقعی کم نمی‌شود.
              </p>
              <button
                type="button"
                onClick={goGateway}
                disabled={saving}
                className="mt-4 w-full rounded-full bg-[#1f4a45] px-4 py-2.5 text-sm text-white disabled:opacity-50"
              >
                {saving
                  ? "در حال انتقال..."
                  : `پرداخت ${formatToman(order.total)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </ShopShell>
  );
}
