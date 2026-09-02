import callApi from "@/helpers/callApi";
import type Coupon from "@/models/coupon";

export async function ValidateShopCoupon(code: string, subtotal: number) {
  const res = await callApi().post("/shop/coupons/validate", { code, subtotal });
  return res.data as {
    code: string;
    type: string;
    value: number;
    discount: number;
    total: number;
  };
}

export async function GetCoupons() {
  const res = await callApi().get("/coupons");
  return (res.data?.coupons ?? []) as Coupon[];
}

export async function CreateCoupon(values: {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder?: number;
  maxUses?: number;
  active?: boolean;
}) {
  const res = await callApi().post("/coupons", values);
  return res.data?.coupon as Coupon;
}

export async function ToggleCoupon(id: number) {
  const res = await callApi().post(`/coupons/${id}/toggle`);
  return res.data?.coupon as Coupon;
}
