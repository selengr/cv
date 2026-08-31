/** Client helper: ask the server to deliver the OTP via SMS provider. */
export async function deliverOtpSms(phone: string, code: string) {
  try {
    const res = await fetch("/api/sms/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) return { sent: false as const, provider: "error" };
    const data = (await res.json()) as {
      sent?: boolean;
      provider?: string;
    };
    return {
      sent: Boolean(data.sent),
      provider: data.provider ?? "unknown",
    };
  } catch {
    return { sent: false as const, provider: "error" };
  }
}

export function shouldShowOtpHint(smsSent: boolean) {
  if (smsSent) return false;
  return process.env.NEXT_PUBLIC_SHOW_OTP_HINT !== "false";
}
