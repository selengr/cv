"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ProductThumb from "@/components/shared/productThumb";
import { fileToProductImage } from "@/helpers/image";

export default function ProductImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const urlValue = value.startsWith("data:") ? "" : value;

  return (
    <div>
      <p className="text-sm font-medium text-gray-700">عکس محصول</p>
      <div className="mt-2 max-w-xs">
        <ProductThumb item={{ image: value || undefined, title: "پیش‌نمایش" }} className="h-36" />
      </div>
      <input
        type="url"
        value={urlValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder="آدرس عکس، یا از پایین فایل بگذار"
        className="mt-3 block w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:border-[#1f4a45] focus:ring-[#1f4a45] focus:outline-none"
        dir="ltr"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
        <label className="cursor-pointer rounded-full border border-[#14110e]/12 bg-white px-3 py-1.5">
          {busy ? "در حال خواندن..." : "انتخاب فایل"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setBusy(true);
              try {
                onChange(await fileToProductImage(file));
              } catch {
                toast.error("این فایل عکس نیست");
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-[#6b6459]">
            حذف عکس
          </button>
        )}
      </div>
    </div>
  );
}
