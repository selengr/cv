import type { UserType } from "@/models/user";
import type Product from "@/models/product";

const USERS_KEY = "shopy_users";
const PRODUCTS_KEY = "shopy_products";
const SESSION_KEY = "shopy_session";
const OTP_KEY = "shopy_otp";
export const OTP_HINT_KEY = "shopy_otp_hint";

export const ADMIN_PERMISSIONS = [
  "manage_products",
  "add_new_product",
  "manage_users",
];

export type StoredUser = UserType & { phone: string };

export type Session = {
  token: string;
  user: UserType;
};

export type PendingOtp = {
  token: string;
  phone: string;
  code: string;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function seedUsers(): StoredUser[] {
  return [
    {
      id: 1,
      name: "ادمین",
      phone: "09121111111",
      permissions: ADMIN_PERMISSIONS,
    },
  ];
}

function seedProducts(): Product[] {
  return [
    {
      id: 1,
      title: "کفش اسپرت",
      category: "1",
      body: "کفش روزمره برای فروش تست",
      price: 1280000,
      user_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "کیف چرم",
      category: "2",
      body: "کیف دستی برای تست پنل",
      price: 2450000,
      user_id: 1,
      created_at: new Date().toISOString(),
    },
  ];
}

export function getUsers(): StoredUser[] {
  const users = readJson<StoredUser[]>(USERS_KEY, []);
  if (users.length === 0) {
    const seeded = seedUsers();
    writeJson(USERS_KEY, seeded);
    return seeded;
  }
  return users;
}

export function saveUsers(users: StoredUser[]) {
  writeJson(USERS_KEY, users);
}

export function getProducts(): Product[] {
  const products = readJson<Product[] | null>(PRODUCTS_KEY, null);
  if (!products) {
    const seeded = seedProducts();
    writeJson(PRODUCTS_KEY, seeded);
    return seeded;
  }
  return products;
}

export function saveProducts(products: Product[]) {
  writeJson(PRODUCTS_KEY, products);
}

export function getSession(): Session | null {
  return readJson<Session | null>(SESSION_KEY, null);
}

export function saveSession(session: Session) {
  writeJson(SESSION_KEY, session);
}

export function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSION_KEY);
}

export function getPendingOtp(): PendingOtp | null {
  return readJson<PendingOtp | null>(OTP_KEY, null);
}

export function savePendingOtp(otp: PendingOtp) {
  writeJson(OTP_KEY, otp);
}

export function clearPendingOtp() {
  if (!canUseStorage()) return;
  localStorage.removeItem(OTP_KEY);
}

export function saveOtpHint(code: string) {
  if (!canUseStorage()) return;
  sessionStorage.setItem(OTP_HINT_KEY, code);
}

export function readOtpHint() {
  if (!canUseStorage()) return null;
  return sessionStorage.getItem(OTP_HINT_KEY);
}

export function clearOtpHint() {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(OTP_HINT_KEY);
}

export function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function randomToken() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function publicUser(user: StoredUser): UserType {
  return {
    id: user.id,
    name: user.name,
    permissions: user.permissions,
  };
}
