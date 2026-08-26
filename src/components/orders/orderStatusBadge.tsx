import { statusClass, statusLabel } from "@/helpers/orders";
import type { OrderStatus } from "@/models/order";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs ${statusClass(status)}`}>
      {statusLabel(status)}
    </span>
  );
}
