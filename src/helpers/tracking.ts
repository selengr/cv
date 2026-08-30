import type { OrderStatus } from "@/models/order";

export type TrackStep = {
  status: OrderStatus;
  label: string;
};

export const TRACK_FLOW: TrackStep[] = [
  { status: "pending", label: "ثبت شد" },
  { status: "paid", label: "پرداخت" },
  { status: "packed", label: "بسته‌بندی" },
  { status: "shipped", label: "ارسال" },
];

export function trackStepIndex(status: OrderStatus) {
  if (status === "cancelled") return -1;
  const index = TRACK_FLOW.findIndex((step) => step.status === status);
  return index >= 0 ? index : 0;
}

export function isTrackStepDone(status: OrderStatus, stepStatus: OrderStatus) {
  if (status === "cancelled") return false;
  return trackStepIndex(status) >= trackStepIndex(stepStatus);
}
