export type PaymentMethod = "online" | "cod";

export const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  hint: string;
}[] = [
  {
    value: "cod",
    label: "پرداخت در محل",
    hint: "سفارش ثبت می‌شود، بعداً تسویه می‌کنی",
  },
  {
    value: "online",
    label: "پرداخت آنلاین",
    hint: "درگاه آزمایشی — پول واقعی کم نمی‌شود",
  },
];

export function paymentLabel(method?: PaymentMethod | string) {
  return (
    PAYMENT_METHODS.find((item) => item.value === method)?.label ?? "نامشخص"
  );
}

/** Zarinpal-shaped sandbox authority token */
export function makeAuthority() {
  const tail = Math.random().toString(36).slice(2, 10).toUpperCase();
  const mid = Date.now().toString(36).toUpperCase();
  return `A000000000000000000000000000${mid}${tail}`.slice(0, 36);
}

export function makeRefId() {
  return String(100000000 + Math.floor(Math.random() * 899999999));
}

export function gatewayPath(authority: string) {
  return `/shop/gateway/${encodeURIComponent(authority)}`;
}

export function callbackPath(authority: string, status: "OK" | "NOK") {
  const query = new URLSearchParams({ Authority: authority, Status: status });
  return `/shop/pay/callback?${query.toString()}`;
}
