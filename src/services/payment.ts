import callApi from "@/helpers/callApi";
import type { PaymentMethod } from "@/helpers/payments";
import type Order from "@/models/order";

export async function PayOrder(
  orderId: number,
  method: PaymentMethod = "online",
) {
  const res = await callApi().post(`/orders/${orderId}/pay`, { method });
  return res.data?.order as Order;
}

export async function GetShopOrder(orderId: number) {
  const res = await callApi().get(`/shop/orders/${orderId}`);
  return res.data as { order: Order };
}

export async function RequestShopPayment(orderId: number) {
  const res = await callApi().post(`/shop/orders/${orderId}/payment/request`);
  return res.data as {
    authority: string;
    amount: number;
    orderId: number;
    redirectUrl: string;
  };
}

export async function GetShopPayment(authority: string) {
  const res = await callApi().get(
    `/shop/payments/${encodeURIComponent(authority)}`,
  );
  return res.data as {
    authority: string;
    amount: number;
    orderId: number;
    customerName: string;
    status: string;
    paid: boolean;
  };
}

export async function VerifyShopPayment(values: {
  Authority: string;
  Status: string;
}) {
  const res = await callApi().post("/shop/payments/verify", values);
  return res.data as {
    verified: boolean;
    order: Order;
    refId?: string;
    message?: string;
  };
}
