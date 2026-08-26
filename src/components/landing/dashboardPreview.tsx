"use client";

import { useState } from "react";

const orders = [
  { id: "1048", name: "نگار احمدی", total: "۱٬۴۶۰٬۰۰۰", status: "در انتظار" },
  { id: "1047", name: "حسین مرادی", total: "۶۴۰٬۰۰۰", status: "پرداخت‌شده" },
  { id: "1046", name: "سارا محمدی", total: "۱٬۲۱۰٬۰۰۰", status: "بسته‌بندی" },
];

const tabs = ["داشبورد", "سفارش‌ها", "محصولات", "کاربران"] as const;

export default function DashboardPreview() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("محصولات");
  const [activeId, setActiveId] = useState("1042");

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#14110e] shadow-[0_40px_80px_-28px_rgba(20,17,14,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#c45c3e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#c9a227]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3d8b7a]" />
        <span className="mr-3 text-xs text-white/40">admin.shopy</span>
      </div>

      <div className="grid min-h-[360px] grid-cols-[4.6rem_1fr] sm:grid-cols-[10.5rem_1fr]">
        <aside className="border-l border-white/8 bg-[#1a2422] p-3 sm:p-4">
          <p className="hidden px-2 text-[11px] text-white/35 sm:block">منو</p>
          <div className="mt-3 space-y-1.5">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`block w-full rounded-lg px-2 py-2 text-right text-xs transition sm:px-3 sm:text-sm ${
                  tab === item
                    ? "bg-white/12 text-white"
                    : "text-white/45 hover:bg-white/6 hover:text-white/80"
                }`}
              >
                <span className="hidden sm:inline">{item}</span>
                <span className="mx-auto block h-1.5 w-6 rounded-full bg-current sm:hidden" />
              </button>
            ))}
          </div>
        </aside>

        <div className="bg-[#f7f3ec] p-4 sm:p-6">
          {tab === "محصولات" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6b6459]">کاتالوگ</p>
                  <h3 className="font-display text-base font-semibold text-[#14110e] sm:text-lg">
                    لیست محصولات
                  </h3>
                </div>
                <span className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-xs text-white">
                  محصول جدید
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                {products.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveId(product.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-right text-sm transition ${
                      index !== products.length - 1 ? "border-b border-[#efe8dc]" : ""
                    } ${activeId === product.id ? "bg-[#1f4a45]/6" : "hover:bg-[#f4efe6]"}`}
                  >
                    <div>
                      <p className="font-medium text-[#14110e]">{product.title}</p>
                      <p className="text-xs text-[#6b6459]">
                        #{product.id} · موجودی {product.stock}
                      </p>
                    </div>
                    <p className="text-[#1f4a45]">{product.price}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "داشبورد" && (
            <div>
              <p className="text-xs text-[#6b6459]">خلاصه امروز</p>
              <h3 className="font-display text-lg font-semibold">وضعیت فروشگاه</h3>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "سفارش باز", value: "۴" },
                  { label: "محصول", value: "۸" },
                  { label: "فروش", value: "۴٫۳م" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white px-3 py-4 shadow-sm">
                    <p className="text-[11px] text-[#6b6459]">{stat.label}</p>
                    <p className="font-display text-2xl font-semibold text-[#14110e]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-24 rounded-xl bg-white p-4 shadow-sm">
                <div className="flex h-full items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-[#1f4a45]/80"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "سفارش‌ها" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6b6459]">فروش</p>
                  <h3 className="font-display text-base font-semibold text-[#14110e] sm:text-lg">
                    سفارش‌های اخیر
                  </h3>
                </div>
                <span className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-xs text-white">
                  سفارش دستی
                </span>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                {orders.map((order, index) => (
                  <div
                    key={order.id}
                    className={`flex w-full items-center justify-between px-4 py-3 text-right text-sm ${
                      index !== orders.length - 1 ? "border-b border-[#efe8dc]" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-[#14110e]">
                        #{order.id} · {order.name}
                      </p>
                      <p className="text-xs text-[#6b6459]">{order.status}</p>
                    </div>
                    <p className="text-[#1f4a45]">{order.total}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "کاربران" && (
            <div>
              <p className="text-xs text-[#6b6459]">دسترسی</p>
              <h3 className="font-display text-lg font-semibold">نقش‌ها</h3>
              <div className="mt-4 space-y-2">
                {[
                  { name: "سارا محمدی", role: "ادمین" },
                  { name: "علی رضایی", role: "فروشنده" },
                ].map((person) => (
                  <div
                    key={person.name}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                  >
                    <p className="text-sm font-medium">{person.name}</p>
                    <span className="rounded-full bg-[#1f4a45]/10 px-2.5 py-1 text-xs text-[#1f4a45]">
                      {person.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
