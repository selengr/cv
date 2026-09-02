"use client";

import type { ProductVariantInput } from "@/contracts/admin/products";

export default function ProductVariantsField({
  value,
  onChange,
}: {
  value: ProductVariantInput[];
  onChange: (next: ProductVariantInput[]) => void;
}) {
  const updateRow = (index: number, patch: Partial<ProductVariantInput>) => {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="sm:col-span-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">سایز / رنگ (اختیاری)</p>
          <p className="mt-1 text-xs text-[#6b6459]">
            اگر گزینه بذاری، موجودی از جمع همین ردیف‌ها حساب می‌شود.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([...value, { size: "", color: "", stock: 1, price: "" }])
          }
          className="rounded-full px-3 py-1.5 text-sm ring-1 ring-[#14110e]/15"
        >
          افزودن گزینه
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((row, index) => (
            <li
              key={row.id ?? `new-${index}`}
              className="grid gap-2 rounded-2xl border border-[#14110e]/10 bg-white/70 p-3 sm:grid-cols-5"
            >
              <input
                value={row.size ?? ""}
                onChange={(event) => updateRow(index, { size: event.target.value })}
                placeholder="سایز"
                className="rounded-xl border border-[#14110e]/10 px-3 py-2 text-sm"
              />
              <input
                value={row.color ?? ""}
                onChange={(event) => updateRow(index, { color: event.target.value })}
                placeholder="رنگ"
                className="rounded-xl border border-[#14110e]/10 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                value={row.stock}
                onChange={(event) =>
                  updateRow(index, { stock: Number(event.target.value) || 0 })
                }
                placeholder="موجودی"
                className="rounded-xl border border-[#14110e]/10 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                value={row.price ?? ""}
                onChange={(event) =>
                  updateRow(index, {
                    price:
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value) || 0,
                  })
                }
                placeholder="قیمت خاص"
                className="rounded-xl border border-[#14110e]/10 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="rounded-xl px-3 py-2 text-sm text-red-700 ring-1 ring-red-200"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
