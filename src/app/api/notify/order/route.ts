import { NextResponse } from "next/server";

/**
 * Optional outbound notify hook for new orders.
 * Without ORDER_NOTIFY_WEBHOOK it only logs (demo-safe).
 */
export async function POST(request: Request) {
  let body: {
    orderId?: number;
    customerName?: string;
    total?: number;
    phone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }

  const payload = {
    orderId: Number(body.orderId),
    customerName: String(body.customerName ?? ""),
    total: Number(body.total ?? 0),
    phone: String(body.phone ?? ""),
    at: new Date().toISOString(),
  };

  const webhook = process.env.ORDER_NOTIFY_WEBHOOK?.trim();
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text: `Shopy order #${payload.orderId} · ${payload.customerName} · ${payload.total}`,
          ...payload,
        }),
      });
      return NextResponse.json({
        delivered: res.ok,
        channel: "webhook",
      });
    } catch {
      return NextResponse.json({
        delivered: false,
        channel: "webhook",
        message: "webhook failed",
      });
    }
  }

  console.info("[shopy-order-notify]", payload);
  return NextResponse.json({ delivered: true, channel: "log" });
}
