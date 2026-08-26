import type { UserType } from "@/models/user";
import type Product from "@/models/product";
import type Order from "@/models/order";

const DATA_VERSION_KEY = "shopy_data_v";
const DATA_VERSION = "5";
const USERS_KEY = "shopy_users";
const PRODUCTS_KEY = "shopy_products";
const ORDERS_KEY = "shopy_orders";
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
    {
      id: 2,
      name: "علی رضایی",
      phone: "09122222222",
      permissions: [],
    },
  ];
}

function seedProducts(): Product[] {
  return [
    {
      id: 1,
      title: "کفش اسپرت سفید",
      category: "2",
      body: "کفش روزمره، سبک و مناسب پیاده‌روی",
      price: 1280000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 11,
      emoji: "👟",
    },
    {
      id: 2,
      title: "کیف چرم دستی",
      category: "2",
      body: "کیف چرم طبیعی برای استفاده روزانه",
      price: 2450000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 3,
      emoji: "👜",
    },
    {
      id: 3,
      title: "تیشرت نخی",
      category: "1",
      body: "تیشرت ساده نخی، چند رنگ",
      price: 320000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 25,
      emoji: "👕",
    },
    {
      id: 4,
      title: "شلوار جین",
      category: "1",
      body: "جین راسته، سایزهای مختلف",
      price: 890000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 8,
      emoji: "👖",
    },
    {
      id: 5,
      title: "کلاه کپ",
      category: "3",
      body: "کلاه نخی تابستانه",
      price: 180000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 15,
      emoji: "🧢",
    },
    {
      id: 6,
      title: "ساعت مچی",
      category: "3",
      body: "ساعت ساده با بند چرم",
      price: 1750000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 3,
      emoji: "⌚",
    },
    {
      id: 7,
      title: "کوله‌پشتی",
      category: "2",
      body: "کوله روزمره برای لپ‌تاپ",
      price: 980000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 6,
      emoji: "🎒",
    },
    {
      id: 8,
      title: "لیوان سرامیک",
      category: "4",
      body: "ست دو تایی لیوان دست‌ساز",
      price: 240000,
      user_id: 1,
      created_at: new Date().toISOString(),
      stock: 20,
      emoji: "☕",
    },
  ];
}

function daysAgo(days: number, hours = 10) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, 20, 0, 0);
  return date.toISOString();
}

function seedOrders(): Order[] {
  return [
    {
      id: 1048,
      customerName: "نگار احمدی",
      customerPhone: "09123334444",
      items: [
        {
          productId: 1,
          title: "کفش اسپرت سفید",
          emoji: "👟",
          price: 1280000,
          qty: 1,
        },
        {
          productId: 5,
          title: "کلاه کپ",
          emoji: "🧢",
          price: 180000,
          qty: 1,
        },
      ],
      total: 1460000,
      status: "pending",
      note: "اگر کفش سایز ۴۰ تمام شد، ۴۱ بفرستید",
      created_at: daysAgo(0, 9),
    },
    {
      id: 1047,
      customerName: "حسین مرادی",
      customerPhone: "09125556666",
      items: [
        {
          productId: 3,
          title: "تیشرت نخی",
          emoji: "👕",
          price: 320000,
          qty: 2,
        },
      ],
      total: 640000,
      status: "paid",
      created_at: daysAgo(0, 14),
    },
    {
      id: 1046,
      customerName: "سارا محمدی",
      customerPhone: "09127778888",
      items: [
        {
          productId: 4,
          title: "شلوار جین",
          emoji: "👖",
          price: 890000,
          qty: 1,
        },
        {
          productId: 3,
          title: "تیشرت نخی",
          emoji: "👕",
          price: 320000,
          qty: 1,
        },
      ],
      total: 1210000,
      status: "packed",
      created_at: daysAgo(1, 16),
    },
    {
      id: 1045,
      customerName: "رضا کاظمی",
      customerPhone: "09120001111",
      items: [
        {
          productId: 2,
          title: "کیف چرم دستی",
          emoji: "👜",
          price: 2450000,
          qty: 1,
        },
      ],
      total: 2450000,
      status: "shipped",
      created_at: daysAgo(2, 11),
    },
    {
      id: 1044,
      customerName: "مینا کریمی",
      customerPhone: "09121234567",
      items: [
        {
          productId: 6,
          title: "ساعت مچی",
          emoji: "⌚",
          price: 1750000,
          qty: 1,
        },
      ],
      total: 1750000,
      status: "cancelled",
      note: "مشتری پشیمان شد",
      created_at: daysAgo(3, 18),
    },
    {
      id: 1043,
      customerName: "امیر حسینی",
      customerPhone: "09129876543",
      items: [
        {
          productId: 7,
          title: "کوله‌پشتی",
          emoji: "🎒",
          price: 980000,
          qty: 1,
        },
        {
          productId: 8,
          title: "لیوان سرامیک",
          emoji: "☕",
          price: 240000,
          qty: 2,
        },
      ],
      total: 1460000,
      status: "pending",
      created_at: daysAgo(4, 12),
    },
  ];
}

export function getUsers(): StoredUser[] {
  ensureSeed();
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
  ensureSeed();
  const products = readJson<Product[] | null>(PRODUCTS_KEY, null);
  if (!products || products.length === 0) {
    const seeded = seedProducts();
    writeJson(PRODUCTS_KEY, seeded);
    return seeded;
  }
  return products;
}

function ensureSeed() {
  if (!canUseStorage()) return;
  if (localStorage.getItem(DATA_VERSION_KEY) === DATA_VERSION) return;
  writeJson(PRODUCTS_KEY, seedProducts());
  writeJson(ORDERS_KEY, seedOrders());
  const users = readJson<StoredUser[]>(USERS_KEY, []);
  if (users.length === 0) writeJson(USERS_KEY, seedUsers());
  localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
}

export function getOrders(): Order[] {
  ensureSeed();
  const orders = readJson<Order[] | null>(ORDERS_KEY, null);
  if (!orders || orders.length === 0) {
    const seeded = seedOrders();
    writeJson(ORDERS_KEY, seeded);
    return seeded;
  }
  return orders;
}

export function saveOrders(orders: Order[]) {
  writeJson(ORDERS_KEY, orders);
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
