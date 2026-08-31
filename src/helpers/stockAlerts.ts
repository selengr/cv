export type StockAlert = {
  id: number;
  productId: number;
  title: string;
  stock: number;
  created_at: string;
  read?: boolean;
};

/** Alert when stock is at or below this after a sale/edit. */
export const STOCK_ALERT_THRESHOLD = 5;
