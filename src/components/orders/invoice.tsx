"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { GetSingleOrder } from "@/services/order";
import { GetShopSettingsPublic } from "@/services/settings";
import LoadingBox from "@/components/shared/loadingBox";
import { formatInvoiceDate, orderItemCount, statusLabel } from "@/helpers/orders";
import { formatToman } from "@/helpers/catalog";
import { formatAddressLine } from "@/helpers/shipping";
import { defaultShopSettings } from "@/helpers/shopSettings";

export default function Invoice({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    { url: `/orders/${orderId}/invoice`, orderId: Number(orderId) },
    GetSingleOrder,
  );
  const { data: settingsData } = useSWR("shop/settings", GetShopSettingsPublic, {
    revalidateOnFocus: false,
  });
  const order = data?.order;
  const settings = settingsData ?? defaultShopSettings();

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
          چاپ فاکتور
        </button>
      </div>

      <article className="invoice-sheet mx-auto max-w-3xl rounded-3xl border border-[#14110e]/10 bg-white p-6 sm:p-10">
        <header className="flex items-start justify-between gap-4 border-b border-[#14110e]/10 pb-6">
          <div>
            <p className="font-display text-2xl font-semibold">{settings.name}</p>
            <p className="mt-1 text-sm text-[#6b6459]">فاکتور فروش</p>
            {settings.phone && (
              <p className="mt-1 text-xs text-[#6b6459]" dir="ltr">
                {settings.phone}
              </p>
            )}
            {settings.address && (
              <p className="mt-1 text-xs text-[#6b6459]">{settings.address}</p>
            )}
          </div>
          <div className="text-left text-sm">
            <p>شماره {order.id.toLocaleString("fa-IR")}</p>
            <p className="mt-1 text-[#6b6459]">{formatInvoiceDate(order.created_at)}</p>
            <p className="mt-1">{statusLabel(order.status)}</p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#6b6459]">خریدار</p>
            <p className="mt-1 font-medium">{order.customerName}</p>
            <p className="mt-1 text-sm" dir="ltr">
              {order.customerPhone}
            </p>
            {order.address && (
              <div className="mt-3 text-sm text-[#5c564d]">
                <p className="text-xs text-[#6b6459]">آدرس تحویل</p>
                <p className="mt-1">
                  {order.address.recipientName} ·{" "}
                  <span dir="ltr">{order.address.phone}</span>
                </p>
                <p className="mt-1">{formatAddressLine(order.address)}</p>
              </div>
            )}
          </div>
          <div className="sm:text-left">
            <p className="text-xs text-[#6b6459]">تعداد اقلام</p>
            <p className="mt-1">
              {orderItemCount(order.items).toLocaleString("fa-IR")} قلم
            </p>
            {order.shippingTitle && (
              <p className="mt-2 text-sm">
                ارسال: {order.shippingTitle}
                {order.shippingFee
                  ? ` · ${formatToman(order.shippingFee)}`
                  : " · رایگان"}
              </p>
            )}
            {order.refId && (
              <p className="mt-2 text-xs text-[#6b6459]" dir="ltr">
                RefID {order.refId}
              </p>
            )}
          </div>
        </section>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-[#14110e]/10 text-[#6b6459]">
              <th className="py-2 text-right font-medium">کالا</th>
              <th className="py-2 text-right font-medium">تعداد</th>
              <th className="py-2 text-right font-medium">قیمت واحد</th>
              <th className="py-2 text-left font-medium">جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={`${item.productId}-${item.title}`} className="border-b border-[#14110e]/6">
                <td className="py-3">
                  {item.emoji} {item.title}
                </td>
                <td className="py-3">{item.qty.toLocaleString("fa-IR")}</td>
                <td className="py-3">{formatToman(item.price)}</td>
                <td className="py-3 text-left">{formatToman(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 space-y-1 text-sm text-[#5c564d]">
          {order.subtotal != null && (
            <p className="flex justify-between gap-3">
              <span>جمع کالا</span>
              <span>{formatToman(order.subtotal)}</span>
            </p>
          )}
          {order.discount ? (
            <p className="flex justify-between gap-3">
              <span>تخفیف{order.couponCode ? ` (${order.couponCode})` : ""}</span>
              <span>−{formatToman(order.discount)}</span>
            </p>
          ) : null}
          {order.shippingTitle && (
            <p className="flex justify-between gap-3">
              <span>ارسال ({order.shippingTitle})</span>
              <span>
                {!order.shippingFee ? "رایگان" : formatToman(order.shippingFee)}
              </span>
            </p>
          )}
        </div>

        <p className="mt-4 text-left font-display text-xl font-semibold">
          جمع کل {formatToman(order.total)}
        </p>

        {order.note && (
          <p className="mt-6 rounded-2xl bg-[#f4efe6] p-4 text-sm text-[#5c564d]">
            {order.note}
          </p>
        )}

        <p className="mt-10 text-xs text-[#6b6459]">
          {settings.invoiceFooter ||
            `این فاکتور از پنل ${settings.name} چاپ شده. برای بایگانی همان «چاپ» مرورگر کافی است.`}
        </p>
      </article>
    </div>
  );
}
