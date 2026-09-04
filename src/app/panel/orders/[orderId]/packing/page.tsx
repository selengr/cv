import PackingSlip from "@/components/orders/packingSlip";

export default function PanelOrderPackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return <PackingSlip params={params} />;
}
