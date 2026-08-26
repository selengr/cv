"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { GetOrders } from "@/services/order";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import OrderStatusBadge from "@/components/orders/orderStatusBadge";
import { ORDER_STATUSES, formatDay, orderItemCount } from "@/helpers/orders";
import { formatToman } from "@/helpers/catalog";
import type { OrderStatus } from "@/models/order";

export default function OrdersList({
  createHref = "/panel/orders/create",
  detailHref = (id: number) => `/panel/orders/${id}`,
}: {
  createHref?: string;
  detailHref?: (id: number) => string;
}) {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const { data, error } = useSWR("orders", GetOrders);
  const loading = !data && !error;
  const filtered = useMemo(() => {
    const orders = data ?? [];
    return status ? orders.filter((item) => item.status === status) : orders;
  }, [data, status]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">سفارش‌ها</h1>
          <p className="mt-2 text-sm text-[#5c564d]">
            چند سفارش نمونه از قبل هست. وضعیت را عوض کن یا یک سفارش دستی ثبت کن.
          </p>
        </div>
        <Link
          href={createHref}
          className="rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
        >
          سفارش دستی
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatus("")}
          className={`rounded-full px-3 py-1.5 text-sm ${
            status === "" ? "bg-[#1f4a45] text-white" : "bg-white"
          }`}
        >
          همه
        </button>
        {ORDER_STATUSES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setStatus(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              status === item.value ? "bg-[#1f4a45] text-white" : "bg-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingBox />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyList title="سفارشی نیست" description="با این فیلتر چیزی پیدا نشد" />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#14110e]/8 bg-white/85 shadow-sm">
          {filtered.map((order, index) => (
            <Link
              key={order.id}
              href={detailHref(order.id)}
              className={`flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${
                index !== filtered.length - 1 ? "border-b border-[#14110e]/8" : ""
              }`}
            >
              <div>
                <p className="font-medium">
                  #{order.id} · {order.customerName}
                </p>
                <p className="text-xs text-[#6b6459]">
                  {formatDay(order.created_at)} · {orderItemCount(order.items).toLocaleString("fa-IR")} قلم
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm">{formatToman(order.total)}</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
