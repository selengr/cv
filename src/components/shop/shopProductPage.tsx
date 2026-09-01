"use client";

import { use, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";
import ShopShell from "@/components/shop/shopShell";
import ProductThumb from "@/components/shared/productThumb";
import LoadingBox from "@/components/shared/loadingBox";
import {
  CreateProductReview,
  GetProductReviews,
  GetShopProduct,
} from "@/services/review";
import { addToCart, cartCount, readCart, subscribeCart } from "@/helpers/cart";
import {
  isInWishlist,
  readWishlist,
  subscribeWishlist,
  toggleWishlist,
  wishlistCount,
} from "@/helpers/wishlist";
import { categoryLabel, formatToman } from "@/helpers/catalog";
import { formatStars } from "@/helpers/reviews";
import { formatDay } from "@/helpers/orders";
import ValidationError from "@/exceptions/validationError";

export default function ShopProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const id = Number(productId);
  const router = useRouter();
  const lines = useSyncExternalStore(subscribeCart, readCart, () => []);
  const wish = useSyncExternalStore(subscribeWishlist, readWishlist, () => []);
  const { data: productData, error, isLoading } = useSWR(
    { url: `/shop/products/${id}`, id },
    ({ id: productIdValue }) => GetShopProduct(productIdValue),
  );
  const { data: reviewData, mutate } = useSWR(
    { url: `/shop/products/${id}/reviews`, id },
    ({ id: productIdValue }) => GetProductReviews(productIdValue),
  );

  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const product = productData?.product;
  const reviews = reviewData?.reviews ?? [];
  const ratingAvg = reviewData?.ratingAvg ?? product?.ratingAvg ?? 0;
  const reviewCount = reviewData?.reviewCount ?? product?.reviewCount ?? 0;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await CreateProductReview(id, {
        authorName: authorName.trim(),
        rating,
        body: body.trim(),
      });
      setAuthorName("");
      setBody("");
      setRating(5);
      await mutate();
      toast.success("نظرت ثبت شد");
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "ثبت نشد"));
        return;
      }
      toast.error("ثبت نشد");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ShopShell cartCount={cartCount(lines)} wishCount={wishlistCount(wish)}>
        <LoadingBox />
      </ShopShell>
    );
  }

  if (error || !product) {
    return (
      <ShopShell cartCount={cartCount(lines)} wishCount={wishlistCount(wish)}>
        <p className="text-sm text-[#6b6459]">این محصول پیدا نشد.</p>
        <button
          type="button"
          onClick={() => router.replace("/shop")}
          className="mt-3 text-sm text-[#1f4a45]"
        >
          برگشت به فروشگاه
        </button>
      </ShopShell>
    );
  }

  const stock = product.stock ?? 0;
  const wished = isInWishlist(product.id, wish);

  return (
    <ShopShell cartCount={cartCount(lines)} wishCount={wishlistCount(wish)}>
      <Link href="/shop" className="text-sm text-[#1f4a45]">
        بازگشت به فروشگاه
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <ProductThumb item={product} className="h-72 sm:h-80" />
        <div>
          <p className="text-xs text-[#1f4a45]">{categoryLabel(product.category)}</p>
          <h1 className="font-display mt-2 text-3xl font-semibold">{product.title}</h1>
          <p className="mt-2 text-sm text-[#5c564d]">{product.body}</p>
          <p className="mt-4 font-display text-2xl font-semibold">
            {formatToman(product.price)}
          </p>
          <p className="mt-2 text-sm text-[#6b6459]">
            {stock.toLocaleString("fa-IR")} عدد ·{" "}
            {reviewCount > 0
              ? `${formatStars(ratingAvg)} ${ratingAvg.toLocaleString("fa-IR")} (${reviewCount.toLocaleString("fa-IR")} نظر)`
              : "هنوز نظری نیست"}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={stock < 1}
              onClick={() => {
                addToCart(product);
                toast.success("به سبد اضافه شد");
              }}
              className="rounded-full bg-[#1f4a45] px-5 py-2.5 text-sm text-white disabled:opacity-40"
            >
              {stock < 1 ? "ناموجود" : "افزودن به سبد"}
            </button>
            <button
              type="button"
              onClick={() => {
                const next = toggleWishlist(product);
                toast.success(
                  isInWishlist(product.id, next)
                    ? "به علاقه‌مندی‌ها اضافه شد"
                    : "از علاقه‌مندی‌ها برداشته شد",
                );
              }}
              className={`rounded-full px-4 py-2.5 text-sm ring-1 ${
                wished
                  ? "bg-[#1f4a45]/10 text-[#1f4a45] ring-[#1f4a45]/20"
                  : "ring-[#14110e]/15"
              }`}
            >
              {wished ? "♥ در علاقه‌مندی‌ها" : "♡ علاقه‌مندی"}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={submit}
          className="h-fit rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm"
        >
          <h2 className="font-display text-xl font-semibold">ثبت نظر</h2>
          <p className="mt-1 text-sm text-[#5c564d]">بدون ورود هم می‌شود نظر داد.</p>
          <label className="mt-4 block text-sm">
            نام
            <input
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="mt-3 block text-sm">
            امتیاز
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="mt-1 w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} ستاره
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm">
            متن نظر
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-2xl border border-[#14110e]/10 px-3 py-2.5 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full rounded-full bg-[#1f4a45] px-4 py-2.5 text-sm text-white disabled:opacity-50"
          >
            {saving ? "در حال ثبت..." : "ارسال نظر"}
          </button>
        </form>

        <div>
          <h2 className="font-display text-xl font-semibold">نظرها</h2>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-[#6b6459]">اولین نفر باش که نظر می‌دهد.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-3xl border border-[#14110e]/8 bg-white/85 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{review.authorName}</p>
                    <span className="text-sm text-amber-700">
                      {formatStars(review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#5c564d]">{review.body}</p>
                  <p className="mt-2 text-xs text-[#6b6459]">
                    {formatDay(review.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </ShopShell>
  );
}
