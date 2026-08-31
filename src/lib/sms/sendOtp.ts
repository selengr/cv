import {
  isKavenegarConfigured,
  otpMessage,
  smsProviderName,
} from "@/lib/sms/config";

export type SendOtpResult = {
  sent: boolean;
  provider: string;
  message?: string;
};

export async function sendOtpSms(
  phone: string,
  code: string,
): Promise<SendOtpResult> {
  const provider = smsProviderName();

  if (provider === "kavenegar" && isKavenegarConfigured()) {
    const apiKey = process.env.KAVENEGAR_API_KEY!.trim();
    const sender = process.env.KAVENEGAR_SENDER?.trim() || "10008663";
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`;
    const body = new URLSearchParams({
      receptor: phone,
      sender,
      message: otpMessage(code),
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      });
      const data = (await res.json()) as {
        return?: { status?: number; message?: string };
      };
      const status = data?.return?.status ?? 0;
      if (res.ok && status === 200) {
        return { sent: true, provider: "kavenegar" };
      }
      return {
        sent: false,
        provider: "kavenegar",
        message: data?.return?.message ?? "ارسال پیامک نشد",
      };
    } catch {
      return {
        sent: false,
        provider: "kavenegar",
        message: "ارتباط با کاوه‌نگار برقرار نشد",
      };
    }
  }

  return {
    sent: false,
    provider: "local",
    message: "حالت محلی — کد روی صفحه نشان داده می‌شود",
  };
}
