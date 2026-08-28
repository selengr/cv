import ShopPayPage from "@/components/shop/shopPayPage";

export default function ShopPayRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return <ShopPayPage params={params} />;
}
