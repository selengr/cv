import OrderDetail from "@/components/orders/orderDetail";

export default function PanelOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return <OrderDetail params={params} />;
}
