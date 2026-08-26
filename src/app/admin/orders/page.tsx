import OrdersList from "@/components/orders/ordersList";

export default function AdminOrdersPage() {
  return (
    <OrdersList
      createHref="/panel/orders/create"
      detailHref={(id) => `/panel/orders/${id}`}
    />
  );
}
