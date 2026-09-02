import callApi from "@/helpers/callApi";
import type { PaymentMethod } from "@/helpers/payments";
import type Product from "@/models/product";
import type Order from "@/models/order";

export async function GetShopProducts() {
  const res = await callApi().get("/shop/products");
  return (res.data?.products ?? []) as Product[];
}

export async function CreateShopOrder(values: {
  customerName: string;
  customerPhone: string;
  note?: string;
  paymentMethod?: PaymentMethod;
  couponCode?: string;
  items: Array<{ productId: number; qty: number }>;
}) {
  const res = await callApi().post("/shop/orders", values);
  return res.data?.order as Order;
}
