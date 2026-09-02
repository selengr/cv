import type ShippingMethod from "@/models/shipping";

export function seedShippingMethods(): ShippingMethod[] {
  return [
    {
      id: 1,
      key: "pickup",
      title: "تحویل حضوری",
      description: "از فروشگاه تحویل بگیر — رایگان",
      fee: 0,
      active: true,
      requiresAddress: false,
    },
    {
      id: 2,
      key: "courier",
      title: "پیک شهری",
      description: "همان‌روز در محدوده شهر",
      fee: 35000,
      freeAbove: 800000,
      active: true,
      requiresAddress: true,
    },
    {
      id: 3,
      key: "post",
      title: "پست پیشتاز",
      description: "۲ تا ۴ روز کاری",
      fee: 45000,
      freeAbove: 1200000,
      active: true,
      requiresAddress: true,
    },
    {
      id: 4,
      key: "tipax",
      title: "تیپاکس",
      description: "سریع‌تر بین شهری",
      fee: 65000,
      active: true,
      requiresAddress: true,
    },
  ];
}

export function resolveShippingFee(
  method: ShippingMethod,
  goodsTotal: number,
) {
  if (!method.active) {
    return { ok: false as const, message: "این روش ارسال فعال نیست" };
  }
  let fee = method.fee;
  if (
    method.freeAbove != null &&
    method.freeAbove > 0 &&
    goodsTotal >= method.freeAbove
  ) {
    fee = 0;
  }
  return { ok: true as const, fee };
}

export function formatAddressLine(address: {
  province: string;
  city: string;
  street: string;
  postalCode?: string;
}) {
  const parts = [address.province, address.city, address.street];
  if (address.postalCode) parts.push(`کدپستی ${address.postalCode}`);
  return parts.filter(Boolean).join("، ");
}
