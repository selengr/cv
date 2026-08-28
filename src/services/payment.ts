import callApi from "@/helpers/callApi";
import type { PaymentMethod } from "@/helpers/payments";
import type Order from "@/models/order";

export async function PayOrder(orderId: number, method: PaymentMethod = "online") {
  const res = await callApi().post(`/orders/${orderId}/pay`, { method });
  return res.data?.order as Order;
}

export async function GetShopOrder(orderId: number) {
  const res = await callApi().get(`/shop/orders/${orderId}`);
  return res.data as { order: Order };
}
