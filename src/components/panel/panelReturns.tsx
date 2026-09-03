"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "react-toastify";
import {
  ApproveReturn,
  GetReturns,
  RejectReturn,
} from "@/services/returns";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import { formatToman } from "@/helpers/catalog";
import { formatDay } from "@/helpers/orders";
import {
  returnStatusClass,
  returnStatusLabel,
} from "@/helpers/returns";
import ValidationError from "@/exceptions/validationError";

export default function PanelReturns() {
  const { data, mutate, isLoading } = useSWR("returns", GetReturns);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  const returns = data ?? [];

  const resolve = async (id: number, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      if (action === "approve") {
        await ApproveReturn(id, notes[id]);
        toast.success("مرجوعی تایید شد و موجودی برگشت");
      } else {
        await RejectReturn(id, notes[id]);
        toast.info("درخواست رد شد");
      }
      await mutate();
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "انجام نشد"));
        return;
      }
      toast.error("انجام نشد");
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading && !data) return <LoadingBox />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">مرجوعی‌ها</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        مشتری برای سفارش ارسال‌شده درخواست می‌دهد. تایید یعنی موجودی برمی‌گردد؛ اگر
        پرداخت آنلاین بوده، وضعیت «بازپرداخت شد» می‌خورد.
      </p>

      {returns.length === 0 ? (
        <div className="mt-8">
          <EmptyList
            title="هنوز درخواستی نیست"
            description="وقتی مشتری مرجوعی بزند اینجا می‌آید"
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {returns.map((item) => (
            <li
              key={item.id}
              className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">
                    سفارش #{item.orderId.toLocaleString("fa-IR")}
                  </p>
                  <p className="mt-1 text-sm text-[#5c564d]">
                    {item.customerName} ·{" "}
                    <span dir="ltr">{item.customerPhone}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#6b6459]">
                    {formatDay(item.created_at)} · {formatToman(item.amount)}
                    {item.paymentMethod === "online" ? " · آنلاین" : " · حضوری"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${returnStatusClass(item.status)}`}
                >
                  {returnStatusLabel(item.status)}
                </span>
              </div>

              <p className="mt-4 rounded-2xl bg-[#f4efe6] p-3 text-sm text-[#5c564d]">
                {item.reason}
              </p>
              {item.sellerNote && (
                <p className="mt-2 text-xs text-[#6b6459]">
                  یادداشت فروشنده: {item.sellerNote}
                </p>
              )}

              {item.status === "pending" && (
                <div className="mt-4 space-y-3">
                  <input
                    value={notes[item.id] ?? ""}
                    onChange={(event) =>
                      setNotes((prev) => ({
                        ...prev,
                        [item.id]: event.target.value,
                      }))
                    }
                    placeholder="یادداشت برای مشتری (اختیاری)"
                    className="w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => resolve(item.id, "approve")}
                      className="rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      تایید مرجوعی
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => resolve(item.id, "reject")}
                      className="rounded-full px-4 py-2 text-sm text-red-700 ring-1 ring-red-200 disabled:opacity-50"
                    >
                      رد
                    </button>
                    <Link
                      href={`/panel/orders/${item.orderId}`}
                      className="rounded-full px-4 py-2 text-sm ring-1 ring-[#14110e]/15"
                    >
                      سفارش
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
