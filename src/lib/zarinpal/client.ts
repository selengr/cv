import { tomanToRial } from "@/lib/zarinpal/config";

function zarinpalBase() {
  const sandbox = process.env.ZARINPAL_SANDBOX !== "false";
  return sandbox
    ? "https://sandbox.zarinpal.com"
    : "https://payment.zarinpal.com";
}

function merchantId() {
  return process.env.ZARINPAL_MERCHANT_ID?.trim() ?? "";
}

export function isZarinpalConfigured() {
  return Boolean(merchantId());
}

export function zarinpalStartPayUrl(authority: string) {
  return `${zarinpalBase()}/pg/StartPay/${authority}`;
}

type ZarinpalRequestResult =
  | { ok: true; authority: string; redirectUrl: string }
  | { ok: false; message: string };

type ZarinpalVerifyResult =
  | { ok: true; refId: string }
  | { ok: false; message: string };

export async function zarinpalRequestPayment(input: {
  amountToman: number;
  description: string;
  callbackUrl: string;
  orderId: number;
}): Promise<ZarinpalRequestResult> {
  const merchant = merchantId();
  if (!merchant) {
    return { ok: false, message: "مرچنت زرین‌پال تنظیم نشده" };
  }

  try {
    const res = await fetch(`${zarinpalBase()}/pg/v4/payment/request.json`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchant,
        amount: tomanToRial(input.amountToman),
        callback_url: input.callbackUrl,
        description: input.description,
        metadata: { order_id: String(input.orderId) },
      }),
    });
    const data = (await res.json()) as {
      data?: { code?: number; authority?: string; message?: string };
      errors?: { message?: string } | unknown[];
    };
    const code = data?.data?.code;
    const authority = data?.data?.authority;
    if (res.ok && code === 100 && authority) {
      return {
        ok: true,
        authority,
        redirectUrl: zarinpalStartPayUrl(authority),
      };
    }
    const errMsg =
      (Array.isArray(data.errors)
        ? undefined
        : (data.errors as { message?: string } | undefined)?.message) ||
      data?.data?.message ||
      "درخواست درگاه ناموفق بود";
    return { ok: false, message: String(errMsg) };
  } catch {
    return { ok: false, message: "ارتباط با زرین‌پال برقرار نشد" };
  }
}

export async function zarinpalVerifyPayment(input: {
  authority: string;
  amountToman: number;
}): Promise<ZarinpalVerifyResult> {
  const merchant = merchantId();
  if (!merchant) {
    return { ok: false, message: "مرچنت زرین‌پال تنظیم نشده" };
  }

  try {
    const res = await fetch(`${zarinpalBase()}/pg/v4/payment/verify.json`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchant,
        amount: tomanToRial(input.amountToman),
        authority: input.authority,
      }),
    });
    const data = (await res.json()) as {
      data?: { code?: number; ref_id?: number; message?: string };
      errors?: { message?: string };
    };
    const code = data?.data?.code;
    // 100 = first verify, 101 = already verified
    if (res.ok && (code === 100 || code === 101) && data?.data?.ref_id != null) {
      return { ok: true, refId: String(data.data.ref_id) };
    }
    return {
      ok: false,
      message: data?.errors?.message || data?.data?.message || "تایید نشد",
    };
  } catch {
    return { ok: false, message: "ارتباط با زرین‌پال برقرار نشد" };
  }
}
