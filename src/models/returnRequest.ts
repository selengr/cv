export type ReturnStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "refunded";

export default interface ReturnRequest {
  id: number;
  orderId: number;
  customerName: string;
  customerPhone: string;
  customerId?: number;
  reason: string;
  status: ReturnStatus;
  amount: number;
  paymentMethod?: "online" | "cod";
  sellerNote?: string;
  created_at: string;
  resolved_at?: string;
}
