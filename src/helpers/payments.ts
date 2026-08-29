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
    hint: "آزمایشی — پول واقعی کم نمی‌شود",
  },
];

export function paymentLabel(method?: PaymentMethod | string) {
  return (
    PAYMENT_METHODS.find((item) => item.value === method)?.label ?? "نامشخص"
  );
}
