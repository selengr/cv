"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate as globalMutate } from "swr";
import { toast } from "react-toastify";
import { GetProducts } from "@/services/product";
import { CreateOrder } from "@/services/order";
import LoadingBox from "@/components/shared/loadingBox";
import { formatToman } from "@/helpers/catalog";
import ProductThumb from "@/components/shared/productThumb";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";
import {
  hasVariants,
  productStock,
  variantLabel,
  variantUnitPrice,
} from "@/helpers/variants";
import ValidationError from "@/exceptions/validationError";
import type Product from "@/models/product";

type Line = {
  productId: number;
  qty: number;
  variantId?: number;
  label?: string;
  unitPrice: number;
};

export default function CreateOrderForm() {
  const router = useRouter();
  const { data, error } = useSWR(
    { url: "/orders/create-products", page: 1, per_page: 50 },
    GetProducts,
  );
  const products = useMemo<Product[]>(() => data?.products ?? [], [data?.products]);
  const loading = !data && !error;
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [saving, setSaving] = useState(false);

  const total = useMemo(() => {
    return lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
  }, [lines]);

  const addProduct = (product: Product) => {
    if (hasVariants(product)) {
      const available = product.variants?.find((item) => item.stock > 0);
      if (!available) {
        toast.error(`موجودی «${product.title}» تمام است`);
        return;
      }
      setLines((current) => {
        const existing = current.find(
          (line) =>
            line.productId === product.id && line.variantId === available.id,
        );
        const qty = (existing?.qty ?? 0) + 1;
        if (qty > available.stock) {
          toast.error(
            `موجودی «${product.title} (${variantLabel(available)})» تمام است`,
          );
          return current;
        }
        if (existing) {
          return current.map((line) =>
            line.productId === product.id && line.variantId === available.id
              ? { ...line, qty }
              : line,
          );
        }
        return [
          ...current,
          {
            productId: product.id,
            variantId: available.id,
            qty: 1,
            label: variantLabel(available),
            unitPrice: variantUnitPrice(product, available),
          },
        ];
      });
      toast.info(`اولین گزینه موجود: ${variantLabel(available)}`);
      return;
    }

    setLines((current) => {
      const existing = current.find(
        (line) => line.productId === product.id && !line.variantId,
      );
      const qty = (existing?.qty ?? 0) + 1;
      if (qty > productStock(product)) {
        toast.error(`موجودی «${product.title}» تمام است`);
        return current;
      }
      if (existing) {
        return current.map((line) =>
          line.productId === product.id && !line.variantId
            ? { ...line, qty }
            : line,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          qty: 1,
          unitPrice: product.price,
        },
      ];
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const phone = normalizeIranianPhone(customerPhone);
    if (customerName.trim().length < 2) {
      toast.error("نام مشتری را بنویس");
      return;
    }
    if (!iranianPhoneRegExp.test(phone)) {
      toast.error("شماره موبایل درست نیست");
      return;
    }
    if (lines.length === 0) {
      toast.error("حداقل یک محصول اضافه کن");
      return;
    }

    setSaving(true);
    try {
      await CreateOrder({
        customerName: customerName.trim(),
        customerPhone: phone,
        note: note.trim() || undefined,
        items: lines.map((line) => ({
          productId: line.productId,
          qty: line.qty,
          variantId: line.variantId,
        })),
      });
      await globalMutate("orders");
      toast.success("سفارش ثبت شد");
      router.push("/panel/orders");
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "سفارش ثبت نشد"));
        return;
      }
      toast.error("سفارش ثبت نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h1 className="font-display text-3xl font-semibold">سفارش دستی</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        برای وقتی که مشتری زنگ می‌زند یا از اینستاگرام سفارش می‌دهد. اگر محصول
        سایز/رنگ دارد، اولین گزینه موجود اضافه می‌شود.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm">نام مشتری</span>
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#14110e]/10 bg-white px-4 py-2.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm">موبایل</span>
          <input
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            inputMode="tel"
            dir="ltr"
            className="mt-1 w-full rounded-2xl border border-[#14110e]/10 bg-white px-4 py-2.5 text-sm"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm">یادداشت</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={2}
          className="mt-1 w-full rounded-2xl border border-[#14110e]/10 bg-white px-4 py-2.5 text-sm"
        />
      </label>

      <h2 className="font-display mt-8 text-xl font-semibold">محصولات</h2>
      {loading ? (
        <div className="mt-4">
          <LoadingBox />
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {products.map((product) => {
            const line = lines.find((item) => item.productId === product.id);
            const stock = productStock(product);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => addProduct(product)}
                disabled={stock < 1}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#14110e]/8 bg-white px-3 py-2 text-right text-sm disabled:opacity-40"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-block w-12 shrink-0">
                    <ProductThumb item={product} className="h-12" compact />
                  </span>
                  <span className="truncate">
                    {product.title}
                    {hasVariants(product) ? " · گزینه‌دار" : ""}
                    {line && (
                      <span className="mr-2 text-[#1f4a45]">
                        × {line.qty.toLocaleString("fa-IR")}
                        {line.label ? ` (${line.label})` : ""}
                      </span>
                    )}
                  </span>
                </span>
                <span className="text-xs text-[#6b6459]">
                  {formatToman(product.price)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium">{formatToman(total)}</p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#1f4a45] px-5 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {saving ? "در حال ثبت..." : "ثبت سفارش"}
        </button>
      </div>
    </form>
  );
}
