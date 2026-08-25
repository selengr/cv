"use client";

import Link from "next/link";
import useSWR from "swr";
import { GetProducts } from "@/services/product";
import useAuth from "@/hooks/useAuth";
import User from "@/models/user";
import ProductCard from "@/components/panel/productCard";
import LoadingBox from "@/components/shared/loadingBox";
import { formatToman } from "@/helpers/catalog";
import type Product from "@/models/product";

export default function PanelHome() {
  const { user } = useAuth();
  const access = new User(user);
  const { data, error } = useSWR(
    { url: "/panel/products", page: 1, per_page: 8 },
    GetProducts,
  );
  const products: Product[] = data?.products ?? [];
  const loading = !data && !error;
  const totalStock = products.reduce((sum, item) => sum + (item.stock ?? 0), 0);
  const totalValue = products.reduce(
    (sum, item) => sum + item.price * (item.stock ?? 0),
    0,
  );

  return (
    <div>
      <p className="text-sm text-[#6b6459]">سلام {user?.name ?? ""}</p>
      <h1 className="font-display mt-1 text-3xl font-semibold">فروشگاهت اینجاست</h1>
      <p className="mt-2 max-w-xl text-sm text-[#5c564d]">
        چند محصول نمونه از قبل گذاشته شده. می‌توانی از مدیریت عوض‌شان کنی یا مال خودت را اضافه کنی.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">محصول</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {(data?.products?.length ?? 0).toLocaleString("fa-IR")}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">موجودی کل</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {totalStock.toLocaleString("fa-IR")}
          </p>
        </div>
        <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
          <p className="text-xs text-[#6b6459]">ارزش موجودی</p>
          <p className="font-display mt-1 text-lg font-semibold">{formatToman(totalValue)}</p>
        </div>
      </div>

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

      <div className="mt-8 flex flex-wrap gap-3">
        {access.canAccess("add_new_product") && (
          <Link
            href="/admin/products/create"
            className="rounded-full bg-[#1f4a45] px-5 py-2.5 text-sm text-white"
          >
            محصول جدید
          </Link>
        )}
        <Link
          href="/panel/products"
          className="rounded-full border border-[#14110e]/12 bg-white px-5 py-2.5 text-sm"
        >
          دیدن کاتالوگ
        </Link>
      </div>
    </div>
  );
}
