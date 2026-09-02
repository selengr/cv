export type CouponType = "percent" | "fixed";

export default interface Coupon {
  id: number;
  code: string;
  type: CouponType;
  /** percent: 1-100, fixed: toman amount */
  value: number;
  active: boolean;
  minOrder?: number;
  maxUses?: number;
  usedCount?: number;
  expires_at?: string;
  created_at: string;
}
