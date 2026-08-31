import { NextResponse } from "next/server";
import {
  isZarinpalConfigured,
  zarinpalVerifyPayment,
} from "@/lib/zarinpal/client";

export async function POST(request: Request) {
  if (!isZarinpalConfigured()) {
    return NextResponse.json(
      { message: "ZARINPAL_MERCHANT_ID را در env بگذار" },
      { status: 503 },
    );
  }

  let body: { authority?: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }

  const authority = String(body.authority ?? "").trim();
  const amount = Number(body.amount);
  if (!authority) {
    return NextResponse.json(
      { errors: { authority: "کد تراکنش نیست" } },
      { status: 422 },
    );
  }
  if (!Number.isFinite(amount) || amount < 1000) {
    return NextResponse.json(
      { errors: { amount: "مبلغ درست نیست" } },
      { status: 422 },
    );
  }

  const result = await zarinpalVerifyPayment({
    authority,
    amountToman: amount,
  });

  if (!result.ok) {
    return NextResponse.json(
      { verified: false, message: result.message },
      { status: 200 },
    );
  }

  return NextResponse.json({
    verified: true,
    refId: result.refId,
  });
}
