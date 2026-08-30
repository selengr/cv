import ShopGatewayPage from "@/components/shop/shopGatewayPage";

export default function ShopGatewayRoute({
  params,
}: {
  params: Promise<{ authority: string }>;
}) {
  return <ShopGatewayPage params={params} />;
}
