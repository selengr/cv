import { Suspense } from "react";
import type { Metadata } from "next";
import ShopOrderConfirmPage from "@/components/shop/shopOrderConfirmPage";
import LoadingBox from "@/components/shared/loadingBox";

export const metadata: Metadata = {
  title: "تایید سفارش",
  robots: { index: false, follow: false },
};

export default function ShopOrderConfirmRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return (
    <Suspense fallback={<LoadingBox />}>
      <ShopOrderConfirmPage params={params} />
    </Suspense>
  );
}
