export type SmsProviderName = "local" | "kavenegar";

export function smsProviderName(): SmsProviderName {
  const raw = (process.env.SMS_PROVIDER ?? "local").toLowerCase();
  return raw === "kavenegar" ? "kavenegar" : "local";
}

export function isKavenegarConfigured() {
  return Boolean(process.env.KAVENEGAR_API_KEY?.trim());
}

export function otpMessage(code: string) {
  return `کد ورود Shopy: ${code}`;
}
