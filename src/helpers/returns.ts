import type { ReturnStatus } from "@/models/returnRequest";
import type Order from "@/models/order";

export const RETURN_STATUSES: { value: ReturnStatus; label: string }[] = [
  { value: "pending", label: "در انتظار" },
  { value: "approved", label: "تایید شده" },
  { value: "rejected", label: "رد شده" },
  { value: "refunded", label: "بازپرداخت شد" },
];

export function returnStatusLabel(status: ReturnStatus) {
  return RETURN_STATUSES.find((item) => item.value === status)?.label ?? status;
}

export function returnStatusClass(status: ReturnStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "approved":
      return "bg-[#1f4a45]/10 text-[#1f4a45]";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-emerald-100 text-emerald-800";
  }
}

/** Shipped or delivered orders can start a return. */
export function canRequestReturn(order: Order) {
  return order.status === "shipped" || order.status === "delivered";
}
