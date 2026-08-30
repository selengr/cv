import callApi from "@/helpers/callApi";
import type Order from "@/models/order";

export async function TrackShopOrder(values: {
  orderId: number;
  phone: string;
}) {
  const res = await callApi().post("/shop/orders/track", values);
  return res.data?.order as Order;
}
