export type OrderNotification = {
  id: number;
  orderId: number;
  customerName: string;
  total: number;
  message: string;
  created_at: string;
  read?: boolean;
};
