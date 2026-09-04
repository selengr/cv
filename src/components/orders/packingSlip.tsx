"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { GetSingleOrder } from "@/services/order";
import LoadingBox from "@/components/shared/loadingBox";
import { formatInvoiceDate, orderItemCount, statusLabel } from "@/helpers/orders";
import { formatAddressLine } from "@/helpers/shipping";

export default function PackingSlip({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    { url: `/orders/${orderId}/packing`, orderId: Number(orderId) },
    GetSingleOrder,
  );
  const order = data?.order;

  if (isLoading) return <LoadingBox />;
  if (error || !order) {
    return (
      <div>
        <p className="text-sm text-[#6b6459]">این سفارش پیدا نشد.</p>
        <button
          type="button"
          onClick={() => router.replace("/panel/orders")}
          className="mt-3 text-sm text-[#1f4a45]"
        >
          برگشت به لیست
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/panel/orders/${order.id}`} className="text-sm text-[#1f4a45]">
          بازگشت به سفارش
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
        >
          چاپ برگه بسته‌بندی
        </button>
      </div>

      <article className="invoice-sheet mx-auto max-w-3xl rounded-3xl border border-[#14110e]/10 bg-white p-6 sm:p-10">
        <header className="flex items-start justify-between gap-4 border-b border-[#14110e]/10 pb-6">
          <div>
            <p className="font-display text-2xl font-semibold">Shopy</p>
            <p className="mt-1 text-sm text-[#6b6459]">برگه بسته‌بندی</p>
          </div>
          <div className="text-left text-sm">
            <p>سفارش {order.id.toLocaleString("fa-IR")}</p>
            <p className="mt-1 text-[#6b6459]">
              {formatInvoiceDate(order.created_at)}
            </p>
            <p className="mt-1">{statusLabel(order.status)}</p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#6b6459]">گیرنده</p>
            <p className="mt-1 font-medium">
              {order.address?.recipientName ?? order.customerName}
            </p>
            <p className="mt-1 text-sm" dir="ltr">
              {order.address?.phone ?? order.customerPhone}
            </p>
            {order.address && (
              <p className="mt-2 text-sm text-[#5c564d]">
                {formatAddressLine(order.address)}
              </p>
            )}
            {order.shippingTitle && (
              <p className="mt-2 text-sm text-[#5c564d]">
                ارسال: {order.shippingTitle}
              </p>
            )}
          </div>
          <div className="sm:text-left">
            <p className="text-xs text-[#6b6459]">تعداد اقلام</p>
            <p className="mt-1 font-medium">
              {orderItemCount(order.items).toLocaleString("fa-IR")} قلم
            </p>
            {order.note && (
              <div className="mt-3 text-sm">
                <p className="text-xs text-[#6b6459]">یادداشت مشتری</p>
                <p className="mt-1 text-[#5c564d]">{order.note}</p>
              </div>
            )}
          </div>
        </section>

        {order.packingNote && (
          <div className="mt-6 rounded-2xl border border-dashed border-[#1f4a45]/35 bg-[#1f4a45]/5 p-4">
            <p className="text-xs font-medium text-[#1f4a45]">
              یادداشت بسته‌بندی (فروشنده)
            </p>
            <p className="mt-2 text-sm text-[#14110e]">{order.packingNote}</p>
          </div>
        )}

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-[#14110e]/10 text-[#6b6459]">
              <th className="py-2 text-right font-medium">کالا</th>
              <th className="py-2 text-right font-medium">تعداد</th>
              <th className="py-2 w-16 text-left font-medium">✓</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr
                key={`${item.productId}-${item.variantId ?? "base"}-${item.title}`}
                className="border-b border-[#14110e]/6"
              >
                <td className="py-3">
                  {item.emoji} {item.title}
                  {(item.size || item.color) && (
                    <span className="mr-2 text-xs text-[#6b6459]">
                      {[item.size, item.color].filter(Boolean).join(" / ")}
                    </span>
                  )}
                </td>
                <td className="py-3">{item.qty.toLocaleString("fa-IR")}</td>
                <td className="py-3 text-left text-lg text-[#c9c2b6]">☐</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-10 text-xs text-[#6b6459]">
          این برگه برای انبار است — قیمت ندارد. قبل از ارسال اقلام را تیک بزن.
        </p>
      </article>
    </div>
  );
}
