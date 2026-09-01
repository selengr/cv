import type Order from "@/models/order";
import type Product from "@/models/product";

const SALES_STATUSES = new Set(["paid", "packed", "shipped"]);

export type DaySales = {
  day: string;
  label: string;
  total: number;
  count: number;
};

export type TopProduct = {
  productId: number;
  title: string;
  qty: number;
  revenue: number;
};

export function salesOrders(orders: Order[]) {
  return orders.filter((order) => SALES_STATUSES.has(order.status));
}

export function revenueTotal(orders: Order[]) {
  return salesOrders(orders).reduce((sum, order) => sum + order.total, 0);
}

export function averageOrderValue(orders: Order[]) {
  const list = salesOrders(orders);
  if (list.length === 0) return 0;
  return Math.round(revenueTotal(orders) / list.length);
}

export function lastNDaysSales(orders: Order[], days = 7): DaySales[] {
  const buckets = new Map<string, DaySales>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, {
      day: key,
      label: date.toLocaleDateString("fa-IR", { weekday: "short", day: "numeric" }),
      total: 0,
      count: 0,
    });
  }

  for (const order of salesOrders(orders)) {
    const key = order.created_at.slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.total += order.total;
    bucket.count += 1;
  }

  return Array.from(buckets.values());
}

export function topProducts(orders: Order[], limit = 5): TopProduct[] {
  const map = new Map<number, TopProduct>();
  for (const order of salesOrders(orders)) {
    for (const item of order.items) {
      const current = map.get(item.productId) ?? {
        productId: item.productId,
        title: item.title,
        qty: 0,
        revenue: 0,
      };
      current.qty += item.qty;
      current.revenue += item.price * item.qty;
      map.set(item.productId, current);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function statusBreakdown(orders: Order[]) {
  const counts: Record<string, number> = {
    pending: 0,
    paid: 0,
    packed: 0,
    shipped: 0,
    cancelled: 0,
  };
  for (const order of orders) {
    counts[order.status] = (counts[order.status] ?? 0) + 1;
  }
  return counts;
}

export function inventoryValue(products: Product[]) {
  return products.reduce(
    (sum, item) => sum + item.price * (item.stock ?? 0),
    0,
  );
}
