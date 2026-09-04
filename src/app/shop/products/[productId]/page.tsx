import type { Metadata } from "next";
import ShopProductPage from "@/components/shop/shopProductPage";
import { PUBLIC_PRODUCT_META } from "@/helpers/productMeta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const id = Number(productId);
  const meta = PUBLIC_PRODUCT_META[id];
  const title = meta?.title ?? `محصول ${productId}`;
  const description = meta?.description ?? "جزئیات محصول در فروشگاه Shopy";
  const images = meta?.image ? [meta.image] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
  };
}

export default function ShopProductRoute({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  return <ShopProductPage params={params} />;
}
