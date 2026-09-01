"use client";

import Link from "next/link";
import useSWR from "swr";
import { toast } from "react-toastify";
import { GetProducts } from "@/services/product";
import { GetOrders } from "@/services/order";
import {
  GetStockAlerts,
  MarkAllStockAlertsRead,
  MarkStockAlertRead,
} from "@/services/stockAlert";
import useAuth from "@/hooks/useAuth";
import User from "@/models/user";
import ProductCard from "@/components/panel/productCard";
import OrderStatusBadge from "@/components/orders/orderStatusBadge";
import LoadingBox from "@/components/shared/loadingBox";
import { formatToman } from "@/helpers/catalog";
import { formatDay } from "@/helpers/orders";
import { STOCK_ALERT_THRESHOLD } from "@/helpers/stockAlerts";
import type Product from "@/models/product";

const OPEN_STATUSES = new Set(["pending", "paid", "packed"]);
const SALES_STATUSES = new Set(["paid", "packed", "shipped"]);

export default function PanelHome() {
  const { user } = useAuth();
  const access = new User(user);
  const { data, error } = useSWR(
    { url: "/panel/products", page: 1, per_page: 50 },
    GetProducts,
  );
  const { data: orders } = useSWR("orders", GetOrders);
  const { data: alerts, mutate: mutateAlerts } = useSWR(
    "stock-alerts",
    GetStockAlerts,
  );
  const products: Product[] = data?.products ?? [];
  const loading = !data && !error;
  const totalStock = products.reduce((sum, item) => sum + (item.stock ?? 0), 0);
  const lowStock = products.filter(
    (item) => (item.stock ?? 0) <= STOCK_ALERT_THRESHOLD,
  );
  const openOrders = (orders ?? []).filter((item) => OPEN_STATUSES.has(item.status));
  const sales = (orders ?? [])
    .filter((item) => SALES_STATUSES.has(item.status))
    .reduce((sum, item) => sum + item.total, 0);
  const unreadAlerts = (alerts ?? []).filter((item) => !item.read);

  const markOne = async (alertId: number) => {
    await MarkStockAlertRead(alertId);
    await mutateAlerts();
  };

  const markAll = async () => {
    await MarkAllStockAlertsRead();
    await mutateAlerts();
    toast.success("همه هشدارها خوانده شد");
  };

  return (
    <div>
      <p className="text-sm text-[#6b6459]">سلام {user?.name ?? ""}</p>
      <h1 className="font-display mt-1 text-3xl font-semibold">فروشگاهت اینجاست</h1>
      <p className="mt-2 max-w-xl text-sm text-[#5c564d]">
        محصولات نمونه و چند سفارش آماده است. وضعیت سفارش را عوض کن یا یکی دستی ثبت کن.
      </p>

      {unreadAlerts.length > 0 && (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/90 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">هشدار موجودی</h2>
              <p className="mt-1 text-sm text-[#5c564d]">
                {unreadAlerts.length.toLocaleString("fa-IR")} مورد خوانده‌نشده (آستانه{" "}
                {STOCK_ALERT_THRESHOLD.toLocaleString("fa-IR")} عدد)
              </p>
            </div>
            <button
              type="button"
              onClick={markAll}
              className="rounded-full px-3 py-1.5 text-sm ring-1 ring-amber-300"
            >
              همه را خواندم
            </button>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {unreadAlerts.slice(0, 5).map((alert) => (
              <li
                key={alert.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2"
              >
                <span>
                  {alert.title}
                  <span className="mr-2 text-xs text-[#6b6459]">
                    {formatDay(alert.created_at)}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-amber-800">
                    {alert.stock.toLocaleString("fa-IR")} عدد
                  </span>
                  <button
                    type="button"
                    onClick={() => markOne(alert.id)}
                    className="text-xs text-[#1f4a45]"
                  >
                    خواندم
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">محصول</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {products.length.toLocaleString("fa-IR")}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">موجودی کل</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {totalStock.toLocaleString("fa-IR")}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">سفارش باز</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {openOrders.length.toLocaleString("fa-IR")}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">فروش قطعی</p>
          <p className="font-display mt-1 text-lg font-semibold">{formatToman(sales)}</p>
        </div>
      </div>

      {orders && orders.length > 0 && (
        <>
          <div className="mt-10 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">آخرین سفارش‌ها</h2>
            <Link href="/panel/orders" className="text-sm text-[#1f4a45]">
              همه سفارش‌ها
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-3xl border border-[#14110e]/8 bg-white/85 shadow-sm">
            {orders.slice(0, 4).map((order, index) => (
              <Link
                key={order.id}
                href={`/panel/orders/${order.id}`}
                className={`flex items-center justify-between px-4 py-3 ${
                  index !== Math.min(orders.length, 4) - 1
                    ? "border-b border-[#14110e]/8"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    #{order.id} · {order.customerName}
                  </p>
                  <p className="text-xs text-[#6b6459]">{formatDay(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm sm:inline">{formatToman(order.total)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">نمونه‌ها</h2>
        <Link href="/panel/products" className="text-sm text-[#1f4a45]">
          همه محصولات
        </Link>
      </div>

      {loading ? (
        <div className="mt-4">
          <LoadingBox />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50/80 p-5">
          <h2 className="font-display text-lg font-semibold">موجودی کم</h2>
          <p className="mt-1 text-sm text-[#5c564d]">
            این‌ها {STOCK_ALERT_THRESHOLD.toLocaleString("fa-IR")} تا یا کمتر مانده‌اند.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {lowStock.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.emoji ?? "📦"} {item.title}
                </span>
                <span className="text-amber-800">
                  {(item.stock ?? 0).toLocaleString("fa-IR")} عدد
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/panel/orders/create"
          className="rounded-full bg-[#1f4a45] px-5 py-2.5 text-sm text-white"
        >
          سفارش دستی
        </Link>
        <Link
          href="/panel/analytics"
          className="rounded-full border border-[#14110e]/12 bg-white px-5 py-2.5 text-sm"
        >
          آمار فروش
        </Link>
        {access.canAccess("add_new_product") && (
          <Link
            href="/admin/products/create"
            className="rounded-full border border-[#14110e]/12 bg-white px-5 py-2.5 text-sm"
          >
            محصول جدید
          </Link>
        )}
      </div>
    </div>
  );
}
