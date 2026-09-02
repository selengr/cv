"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import {
  GetShippingMethods,
  UpdateShippingMethod,
} from "@/services/shipping";
import LoadingBox from "@/components/shared/loadingBox";
import { formatToman } from "@/helpers/catalog";
import ValidationError from "@/exceptions/validationError";
import type ShippingMethod from "@/models/shipping";

export default function PanelShipping() {
  const { data, mutate, isLoading } = useSWR(
    "shipping-methods",
    GetShippingMethods,
  );
  const [busyId, setBusyId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<
    Record<number, { fee: string; freeAbove: string }>
  >({});

  const methods = data ?? [];

  const draftFor = (method: ShippingMethod) =>
    drafts[method.id] ?? {
      fee: String(method.fee),
      freeAbove: method.freeAbove != null ? String(method.freeAbove) : "",
    };

  const save = async (method: ShippingMethod) => {
    const draft = draftFor(method);
    setBusyId(method.id);
    try {
      await UpdateShippingMethod(method.id, {
        fee: Number(draft.fee),
        freeAbove: draft.freeAbove.trim() === "" ? null : Number(draft.freeAbove),
      });
      await mutate();
      toast.success("ذخیره شد");
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "ذخیره نشد"));
        return;
      }
      toast.error("ذخیره نشد");
    } finally {
      setBusyId(null);
    }
  };

  const toggle = async (method: ShippingMethod) => {
    setBusyId(method.id);
    try {
      await UpdateShippingMethod(method.id, { active: !method.active });
      await mutate();
      toast.success(method.active ? "غیرفعال شد" : "فعال شد");
    } catch {
      toast.error("تغییر وضعیت نشد");
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading && !data) return <LoadingBox />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">روش‌های ارسال</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        هزینه و آستانه ارسال رایگان را اینجا تنظیم کن. مشتری در تسویه می‌بیند.
      </p>

      <ul className="mt-8 space-y-4">
        {methods.map((method) => {
          const draft = draftFor(method);
          return (
            <li
              key={method.id}
              className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">
                    {method.title}
                  </p>
                  <p className="mt-1 text-sm text-[#5c564d]">
                    {method.description}
                    {method.requiresAddress ? " · نیاز به آدرس" : " · بدون آدرس"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === method.id}
                  onClick={() => toggle(method)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    method.active
                      ? "bg-[#1f4a45] text-white"
                      : "ring-1 ring-[#14110e]/15 text-[#6b6459]"
                  }`}
                >
                  {method.active ? "فعال" : "غیرفعال"}
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-[#5c564d]">هزینه (تومان)</span>
                  <input
                    type="number"
                    min={0}
                    value={draft.fee}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [method.id]: {
                          ...draft,
                          fee: event.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-[#5c564d]">
                    رایگان از (خالی = ندارد)
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={draft.freeAbove}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [method.id]: {
                          ...draft,
                          freeAbove: event.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5"
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6b6459]">
                <span>
                  الان: {method.fee === 0 ? "رایگان" : formatToman(method.fee)}
                  {method.freeAbove
                    ? ` · رایگان از ${formatToman(method.freeAbove)}`
                    : ""}
                </span>
                <button
                  type="button"
                  disabled={busyId === method.id}
                  onClick={() => save(method)}
                  className="rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {busyId === method.id ? "..." : "ذخیره"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
