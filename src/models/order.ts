export type OrderStatus =
  | "pending"
  | "paid"
  | "packed"
  | "shipped"
  | "cancelled";

export interface OrderItem {
  productId: number;
  title: string;
  emoji: string;
  image?: string;
  price: number;
  qty: number;
}

export default interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  note?: string;
  created_at: string;
  paymentMethod?: "online" | "cod";
  paid_at?: string;
  /** Sandbox gateway authority (Zarinpal-shaped) */
  authority?: string;
  /** Payment confirmation code after verify */
  refId?: string;
}
