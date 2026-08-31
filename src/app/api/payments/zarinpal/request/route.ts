import { NextResponse } from "next/server";
import {
  isZarinpalConfigured,
  zarinpalRequestPayment,
} from "@/lib/zarinpal/client";
import { appBaseUrl } from "@/lib/zarinpal/config";

export async function POST(request: Request) {
  if (!isZarinpalConfigured()) {
    return NextResponse.json(
      { message: "ZARINPAL_MERCHANT_ID را در env بگذار" },
      { status: 503 },
    );
  }

  let body: {
    orderId?: number;
    amount?: number;
    description?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }

  const orderId = Number(body.orderId);
  const amount = Number(body.amount);
  if (!Number.isFinite(orderId) || orderId < 1) {
    return NextResponse.json(
      { errors: { orderId: "سفارش درست نیست" } },
      { status: 422 },
    );
  }
  if (!Number.isFinite(amount) || amount < 1000) {
    return NextResponse.json(
      { errors: { amount: "مبلغ درست نیست" } },
      { status: 422 },
    );
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    appBaseUrl();
  const callbackUrl = `${String(origin).replace(/\/$/, "")}/shop/pay/callback`;

  const result = await zarinpalRequestPayment({
    orderId,
    amountToman: amount,
    description: body.description?.trim() || `سفارش ${orderId}`,
    callbackUrl,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 502 });
  }

  return NextResponse.json({
    authority: result.authority,
    redirectUrl: result.redirectUrl,
  });
}
