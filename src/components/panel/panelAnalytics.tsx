"use client";

import useSWR from "swr";
import { GetOrders } from "@/services/order";
import { GetProducts } from "@/services/product";
import LoadingBox from "@/components/shared/loadingBox";
import { formatToman } from "@/helpers/catalog";
import { statusLabel } from "@/helpers/orders";
import {
  averageOrderValue,
  inventoryValue,
  lastNDaysSales,
  revenueTotal,
  salesOrders,
  statusBreakdown,
  topProducts,
} from "@/helpers/analytics";

export default function PanelAnalytics() {
  const { data: orders, error: ordersError } = useSWR("orders", GetOrders);
  const { data: productsData, error: productsError } = useSWR(
    { url: "/panel/analytics/products", page: 1, per_page: 100 },
    GetProducts,
  );

  const loading = (!orders && !ordersError) || (!productsData && !productsError);
  const list = orders ?? [];
  const products = productsData?.products ?? [];
  const days = lastNDaysSales(list, 7);
  const maxDay = Math.max(...days.map((day) => day.total), 1);
  const tops = topProducts(list);
  const breakdown = statusBreakdown(list);
  const sold = salesOrders(list);

  if (loading) return <LoadingBox />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">آمار فروش</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        خلاصه هفت روز اخیر و پرفروش‌ها، از سفارش‌های پرداخت‌شده به بعد.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">فروش قطعی</p>
          <p className="font-display mt-1 text-xl font-semibold">
            {formatToman(revenueTotal(list))}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">تعداد فروش</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {sold.length.toLocaleString("fa-IR")}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">میانگین سبد</p>
          <p className="font-display mt-1 text-xl font-semibold">
            {formatToman(averageOrderValue(list))}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">ارزش موجودی</p>
          <p className="font-display mt-1 text-xl font-semibold">
            {formatToman(inventoryValue(products))}
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm">
        <h2 className="font-display text-xl font-semibold">۷ روز اخیر</h2>
        <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
          {days.map((day) => (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-36 w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-xl bg-[#1f4a45] transition-all"
                  style={{
                    height: `${Math.max(6, (day.total / maxDay) * 100)}%`,
                    opacity: day.total === 0 ? 0.25 : 1,
                  }}
                  title={formatToman(day.total)}
                />
              </div>
              <p className="text-[10px] text-[#6b6459] sm:text-xs">{day.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm">
          <h2 className="font-display text-xl font-semibold">پرفروش‌ها</h2>
          {tops.length === 0 ? (
            <p className="mt-3 text-sm text-[#6b6459]">هنوز فروش قطعی نیست.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#14110e]/8">
              {tops.map((item, index) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span>
                    <span className="ml-2 text-[#6b6459]">
                      {(index + 1).toLocaleString("fa-IR")}.
                    </span>
                    {item.title}
                    <span className="mr-2 text-xs text-[#6b6459]">
                      × {item.qty.toLocaleString("fa-IR")}
                    </span>
                  </span>
                  <span>{formatToman(item.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm">
          <h2 className="font-display text-xl font-semibold">وضعیت سفارش‌ها</h2>
          <ul className="mt-4 space-y-3">
            {Object.entries(breakdown).map(([status, count]) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <span>{statusLabel(status as never)}</span>
                <span className="font-medium">{count.toLocaleString("fa-IR")}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
