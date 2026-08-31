import callApi from "@/helpers/callApi";
import ValidationError from "@/exceptions/validationError";
import type { PaymentMethod } from "@/helpers/payments";
import { paymentDriver } from "@/lib/zarinpal/config";
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
  if (paymentDriver() === "zarinpal") {
    const { order } = await GetShopOrder(orderId);
    if (order.status !== "pending") {
      throw new ValidationError({ status: ["قبلا پرداخت شده"] });
    }

    const res = await fetch("/api/payments/zarinpal/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        amount: order.total,
        description: `سفارش ${order.id}`,
      }),
    });
    const data = (await res.json()) as {
      authority?: string;
      redirectUrl?: string;
      message?: string;
      errors?: Record<string, string | string[]>;
    };
    if (!res.ok || !data.authority || !data.redirectUrl) {
      if (data.errors) throw new ValidationError(data.errors);
      throw new ValidationError({
        payment: [data.message ?? "درگاه زرین‌پال باز نشد"],
      });
    }

    await callApi().post(`/shop/orders/${orderId}/payment/bind`, {
      authority: data.authority,
    });

    return {
      authority: data.authority,
      amount: order.total,
      orderId: order.id,
      redirectUrl: data.redirectUrl,
    };
  }

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
  if (paymentDriver() === "zarinpal" && values.Status.toUpperCase() === "OK") {
    const session = await GetShopPayment(values.Authority);
    const zar = await fetch("/api/payments/zarinpal/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        authority: values.Authority,
        amount: session.amount,
      }),
    });
    const zarData = (await zar.json()) as {
      verified?: boolean;
      refId?: string;
      message?: string;
    };
    if (!zarData.verified) {
      const res = await callApi().post("/shop/payments/verify", {
        Authority: values.Authority,
        Status: "NOK",
      });
      return {
        ...(res.data as {
          verified: boolean;
          order: Order;
          refId?: string;
          message?: string;
        }),
        message: zarData.message ?? "تایید زرین‌پال نشد",
        verified: false,
      };
    }

    const res = await callApi().post("/shop/payments/verify", {
      Authority: values.Authority,
      Status: "OK",
      refId: zarData.refId,
    });
    return res.data as {
      verified: boolean;
      order: Order;
      refId?: string;
      message?: string;
    };
  }

  const res = await callApi().post("/shop/payments/verify", values);
  return res.data as {
    verified: boolean;
    order: Order;
    refId?: string;
    message?: string;
  };
}
