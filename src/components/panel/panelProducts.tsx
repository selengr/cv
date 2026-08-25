"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { GetProducts } from "@/services/product";
import ProductCard from "@/components/panel/productCard";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import { CATEGORIES } from "@/helpers/catalog";
import type Product from "@/models/product";

export default function PanelProducts() {
  const [category, setCategory] = useState("");
  const { data, error } = useSWR(
    { url: "/panel/products-all", page: 1, per_page: 50 },
    GetProducts,
  );
  const loading = !data && !error;
  const products: Product[] = data?.products ?? [];
  const filtered = useMemo(
    () =>
      category
        ? products.filter((item) => item.category === category)
        : products,
    [category, products],
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">کاتالوگ</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        محصولات نمونه به‌علاوه هر چیزی که خودت اضافه کرده باشی.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("")}
          className={`rounded-full px-3 py-1.5 text-sm ${
            category === "" ? "bg-[#1f4a45] text-white" : "bg-white"
          }`}
        >
          همه
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setCategory(item.value)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              category === item.value ? "bg-[#1f4a45] text-white" : "bg-white"
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
          <EmptyList title="محصولی نیست" description="این دسته خالی است" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
