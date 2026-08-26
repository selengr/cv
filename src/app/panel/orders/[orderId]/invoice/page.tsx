import Invoice from "@/components/orders/invoice";

export default function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return <Invoice params={params} />;
}
