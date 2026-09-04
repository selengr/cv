import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "مرور محصولات، سبد خرید و ثبت سفارش",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
