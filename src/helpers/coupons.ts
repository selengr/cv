import type Coupon from "@/models/coupon";

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function applyCoupon(coupon: Coupon, subtotal: number) {
  if (!coupon.active) {
    return { ok: false as const, message: "این کد فعال نیست" };
  }
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { ok: false as const, message: "این کد منقضی شده" };
  }
  if (
    coupon.maxUses != null &&
    (coupon.usedCount ?? 0) >= coupon.maxUses
  ) {
    return { ok: false as const, message: "ظرفیت این کد تمام شده" };
  }
  if (coupon.minOrder != null && subtotal < coupon.minOrder) {
    return {
      ok: false as const,
      message: `حداقل سفارش برای این کد ${coupon.minOrder.toLocaleString("fa-IR")} تومان است`,
    };
  }

  let discount = 0;
  if (coupon.type === "percent") {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }
  discount = Math.min(discount, subtotal);
  return {
    ok: true as const,
    discount,
    total: Math.max(0, subtotal - discount),
  };
}
