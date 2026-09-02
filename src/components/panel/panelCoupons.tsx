"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import {
  CreateCoupon,
  GetCoupons,
  ToggleCoupon,
} from "@/services/coupon";
import LoadingBox from "@/components/shared/loadingBox";
import { formatToman } from "@/helpers/catalog";
import ValidationError from "@/exceptions/validationError";

export default function PanelCoupons() {
  const { data, mutate, isLoading } = useSWR("coupons", GetCoupons);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("10");
  const [minOrder, setMinOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await CreateCoupon({
        code,
        type,
        value: Number(value),
        minOrder: Number(minOrder) || undefined,
      });
      setCode("");
      await mutate();
      toast.success("کد ساخته شد");
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "ساخته نشد"));
        return;
      }
      toast.error("ساخته نشد");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !data) return <LoadingBox />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">کدهای تخفیف</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        مشتری در فروشگاه کد را موقع تسویه می‌زند. نمونه‌ها: WELCOME10 و SAVE50K
      </p>

      <form
        onSubmit={create}
        className="mt-8 grid max-w-2xl gap-3 rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm sm:grid-cols-2"
      >
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="کد (مثلاً SPRING20)"
          dir="ltr"
          className="rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm sm:col-span-2"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as "percent" | "fixed")}
          className="rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
        >
          <option value="percent">درصدی</option>
          <option value="fixed">مبلغ ثابت</option>
        </select>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          type="number"
          placeholder={type === "percent" ? "درصد" : "تومان"}
          className="rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
        />
        <input
          value={minOrder}
          onChange={(event) => setMinOrder(event.target.value)}
          type="number"
          placeholder="حداقل سفارش"
          className="rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm sm:col-span-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#1f4a45] px-4 py-2.5 text-sm text-white disabled:opacity-50 sm:col-span-2"
        >
          {saving ? "..." : "ساخت کد"}
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {(data ?? []).map((coupon) => (
          <li
            key={coupon.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#14110e]/8 bg-white/85 px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-medium" dir="ltr">
                {coupon.code}
              </p>
              <p className="mt-1 text-sm text-[#5c564d]">
                {coupon.type === "percent"
                  ? `${coupon.value}%`
                  : formatToman(coupon.value)}
                {coupon.minOrder
                  ? ` · حداقل ${formatToman(coupon.minOrder)}`
                  : ""}
                {` · استفاده ${(coupon.usedCount ?? 0).toLocaleString("fa-IR")}`}
                {coupon.maxUses
                  ? `/${coupon.maxUses.toLocaleString("fa-IR")}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await ToggleCoupon(coupon.id);
                await mutate();
              }}
              className={`rounded-full px-3 py-1.5 text-sm ${
                coupon.active
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {coupon.active ? "فعال" : "غیرفعال"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
