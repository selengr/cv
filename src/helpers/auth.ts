export const iranianPhoneRegExp = /^(?:0|98|\+98|0098)?9\d{9}$/;

export function normalizeIranianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0098")) return `0${digits.slice(4)}`;
  if (digits.startsWith("98") && digits.length >= 12) return `0${digits.slice(2)}`;
  if (digits.startsWith("9") && digits.length === 10) return `0${digits}`;

  return digits.startsWith("0") ? digits : phone;
}

const PHONE_VERIFY_KEY = "shopy_phone_verify_token";

export function savePhoneVerifyToken(token: string) {
  sessionStorage.setItem(PHONE_VERIFY_KEY, token);
}

export function readPhoneVerifyToken() {
  return sessionStorage.getItem(PHONE_VERIFY_KEY);
}

export function clearPhoneVerifyTokenStorage() {
  sessionStorage.removeItem(PHONE_VERIFY_KEY);
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const storeLoginToken = async (token: string) => {
  if (!token) {
    throw new Error("empty login token");
  }

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error("could not store login token");
  }
};

export const removeLoginToken = async () => {
  await fetch("/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
  });
};

export { cookieOptions };
