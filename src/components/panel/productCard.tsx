"use client";

import Link from "next/link";
import { categoryLabel, formatToman } from "@/helpers/catalog";
import useAuth from "@/hooks/useAuth";
import User from "@/models/user";
import type Product from "@/models/product";

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const canEdit = new User(user).canAccess("manage_products");
  const stock = product.stock ?? 0;

  return (
    <article className="flex flex-col rounded-3xl border border-[#14110e]/8 bg-white/85 p-4 shadow-sm">
      <div className="flex h-28 items-center justify-center rounded-2xl bg-[#1f4a45]/8 text-5xl">
        {product.emoji ?? "📦"}
      </div>
      <p className="mt-3 text-xs text-[#1f4a45]">{categoryLabel(product.category)}</p>
      <h3 className="font-display mt-1 text-lg font-semibold">{product.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-[#6b6459]">{product.body}</p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <p className="text-sm font-medium text-[#14110e]">{formatToman(product.price)}</p>
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            stock > 5 ? "bg-[#1f4a45]/10 text-[#1f4a45]" : "bg-amber-100 text-amber-800"
          }`}
        >
          موجودی {stock.toLocaleString("fa-IR")}
        </span>
      </div>
      {canEdit && (
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="mt-3 text-left text-xs text-[#1f4a45]"
        >
          ویرایش
        </Link>
      )}
    </article>
  );
}
