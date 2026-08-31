import { NextResponse } from "next/server";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";
import { sendOtpSms } from "@/lib/sms/sendOtp";

export async function POST(request: Request) {
  let body: { phone?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "bad request" }, { status: 400 });
  }

  const phone = normalizeIranianPhone(String(body.phone ?? ""));
  const code = String(body.code ?? "").trim();

  if (!iranianPhoneRegExp.test(phone)) {
    return NextResponse.json(
      { errors: { phone: "شماره درست نیست" } },
      { status: 422 },
    );
  }
  if (!/^\d{4,8}$/.test(code)) {
    return NextResponse.json(
      { errors: { code: "کد درست نیست" } },
      { status: 422 },
    );
  }

  const result = await sendOtpSms(phone, code);
  return NextResponse.json(result, { status: result.sent ? 200 : 200 });
}
