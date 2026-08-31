export type PaymentDriver = "local" | "zarinpal";

export function paymentDriver(): PaymentDriver {
  const raw = (process.env.NEXT_PUBLIC_PAYMENT_DRIVER ?? "local").toLowerCase();
  return raw === "zarinpal" ? "zarinpal" : "local";
}

export function appBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/** Zarinpal amounts are in Rials; shop prices are Tomans. */
export function tomanToRial(toman: number) {
  return Math.round(toman) * 10;
}
