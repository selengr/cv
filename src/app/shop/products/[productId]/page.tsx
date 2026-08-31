import ShopProductPage from "@/components/shop/shopProductPage";

export default function ShopProductRoute({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  return <ShopProductPage params={params} />;
}
