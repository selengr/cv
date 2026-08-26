import { AxiosError, AxiosHeaders } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";
import { nextStatuses } from "@/helpers/orders";
import { permissionsForRole, roleFromPermissions } from "@/helpers/roles";
import type { ShopRole } from "@/helpers/roles";
import type { OrderItem, OrderStatus } from "@/models/order";
import {
  ADMIN_PERMISSIONS,
  clearPendingOtp,
  clearSession,
  getPendingOtp,
  getProducts,
  getOrders,
  getSession,
  getUsers,
  nextId,
  publicUser,
  randomOtp,
  randomToken,
  saveOtpHint,
  saveOrders,
  savePendingOtp,
  saveProducts,
  saveSession,
  saveUsers,
} from "@/helpers/localDb";

function pathOf(config: InternalAxiosRequestConfig) {
  const raw = config.url ?? "";
  const [pathname, query] = raw.split("?");
  return {
    path: pathname || "/",
    search: new URLSearchParams(query ?? ""),
  };
}

function bodyOf(config: InternalAxiosRequestConfig) {
  if (!config.data) return {};
  if (typeof config.data === "string") {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data as Record<string, unknown>;
}

function ok(
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
): AxiosResponse {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
    request: {},
  };
}

function fail(
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
) {
  return new AxiosError(
    "Request failed",
    status === 401 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE,
    config,
    undefined,
    {
      status,
      data,
      statusText: "Error",
      headers: new AxiosHeaders(),
      config,
    },
  );
}

export function handleLocalRequest(
  config: InternalAxiosRequestConfig,
): AxiosResponse | null {
  const method = (config.method ?? "get").toUpperCase();
  const { path, search } = pathOf(config);
  const body = bodyOf(config);

  if (method === "POST" && path === "/auth/register") {
    const name = String(body.name ?? "").trim();
    const phone = normalizeIranianPhone(String(body.phone ?? ""));
    const users = getUsers();

    if (name.length < 2) {
      throw fail(config, 422, { errors: { name: "نام را درست بنویس" } });
    }
    if (users.some((user) => user.phone === phone)) {
      throw fail(config, 422, {
        errors: { phone: "این شماره قبلا ثبت شده" },
      });
    }

    const user = {
      id: nextId(users),
      name,
      phone,
      permissions: users.length === 0 ? ADMIN_PERMISSIONS : [],
    };
    // first account is admin; later ones start as seller
    saveUsers([...users, user]);
    return ok(config, { user: publicUser(user) }, 201);
  }

  if (method === "POST" && path === "/auth/login") {
    const phone = normalizeIranianPhone(String(body.phone ?? ""));
    const user = getUsers().find((item) => item.phone === phone);
    if (!user) {
      throw fail(config, 422, {
        errors: { phone: "این شماره ثبت نشده. اول ثبت‌نام کن" },
      });
    }

    const token = randomToken();
    const code = randomOtp();
    savePendingOtp({ token, phone, code });
    saveOtpHint(code);
    return ok(config, { token, debug_code: code });
  }

  if (method === "POST" && path === "/auth/login/verify-phone") {
    const token = String(body.token ?? "");
    const code = String(body.code ?? "");
    const pending = getPendingOtp();

    if (!pending || pending.token !== token) {
      throw fail(config, 422, { errors: { code: "نشست ورود منقضی شده" } });
    }
    if (pending.code !== code) {
      throw fail(config, 422, { errors: { code: "کد درست نیست" } });
    }

    const stored = getUsers().find((item) => item.phone === pending.phone);
    if (!stored) {
      throw fail(config, 422, { errors: { code: "کاربر پیدا نشد" } });
    }

    const sessionToken = randomToken();
    const user = publicUser(stored);
    saveSession({ token: sessionToken, user });
    clearPendingOtp();
    return ok(config, { user: { ...user, token: sessionToken } });
  }

  if (method === "GET" && path === "/users") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    if (!session.user.permissions?.includes("manage_users")) {
      throw fail(config, 403, { message: "forbidden" });
    }
    return ok(config, {
      users: getUsers().map((user) => ({
        ...publicUser(user),
        phone: user.phone,
      })),
    });
  }

  const userRoleMatch = path.match(/^\/users\/(\d+)\/role$/);
  if (method === "POST" && userRoleMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    if (!session.user.permissions?.includes("manage_users")) {
      throw fail(config, 403, { message: "forbidden" });
    }

    const id = Number(userRoleMatch[1]);
    const role = String(body.role ?? "") as ShopRole;
    if (role !== "admin" && role !== "seller") {
      throw fail(config, 422, { errors: { role: "نقش درست نیست" } });
    }

    const users = getUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });

    const currentRole = roleFromPermissions(users[index].permissions);
    if (currentRole === "admin" && role === "seller") {
      const adminCount = users.filter(
        (user) => roleFromPermissions(user.permissions) === "admin",
      ).length;
      if (adminCount <= 1) {
        throw fail(config, 422, {
          errors: { role: "حداقل یک ادمین باید بماند" },
        });
      }
    }

    users[index] = {
      ...users[index],
      permissions: permissionsForRole(role),
    };
    saveUsers(users);

    if (session.user.id === id) {
      const nextUser = publicUser(users[index]);
      saveSession({ ...session, user: nextUser });
    }

    return ok(config, {
      user: {
        ...publicUser(users[index]),
        phone: users[index].phone,
      },
    });
  }

  if (method === "GET" && path === "/user") {
    const session = getSession();
    if (!session) {
      throw fail(config, 401, { message: "unauthenticated" });
    }
    return ok(config, { user: session.user });
  }

  if (method === "GET" && path === "/products") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });

    const page = Number(search.get("page") ?? 1) || 1;
    const perPage = Number(search.get("per_page") ?? 10) || 10;
    const all = getProducts();
    const start = (page - 1) * perPage;
    const data = all.slice(start, start + perPage);
    return ok(config, {
      data,
      total_page: Math.max(1, Math.ceil(all.length / perPage)),
    });
  }

  const productMatch = path.match(/^\/products\/(\d+)$/);
  if (method === "GET" && productMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const id = Number(productMatch[1]);
    const product = getProducts().find((item) => item.id === id);
    if (!product) throw fail(config, 404, { message: "not found" });
    return ok(config, { product });
  }

  if (method === "POST" && path === "/products/create") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const products = getProducts();
    const product = {
      id: nextId(products),
      title: String(body.title ?? ""),
      category: String(body.category ?? body.category_id ?? ""),
      body: String(body.body ?? body.description ?? ""),
      price: Number(body.price ?? 0),
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      stock: Number(body.stock ?? 1),
      emoji: String(body.emoji ?? "📦"),
      image: String(body.image ?? "").trim() || undefined,
    };
    saveProducts([product, ...products]);
    return ok(config, { product }, 201);
  }

  const updateMatch = path.match(/^\/products\/(\d+)\/update$/);
  if (method === "POST" && updateMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const id = Number(updateMatch[1]);
    const products = getProducts();
    const index = products.findIndex((item) => item.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    products[index] = {
      ...products[index],
      title: String(body.title ?? products[index].title),
      category: String(body.category ?? body.category_id ?? products[index].category),
      body: String(body.body ?? body.description ?? products[index].body),
      price: Number(body.price ?? products[index].price),
      stock: Number(body.stock ?? products[index].stock ?? 0),
      emoji: String(body.emoji ?? products[index].emoji ?? "📦"),
      image: String(body.image ?? products[index].image ?? "").trim() || undefined,
    };
    saveProducts(products);
    return ok(config, { product: products[index] });
  }

  const deleteMatch = path.match(/^\/products\/(\d+)\/delete$/);
  if (method === "POST" && deleteMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const id = Number(deleteMatch[1]);
    saveProducts(getProducts().filter((item) => item.id !== id));
    return ok(config, { status: "success" });
  }

  if (method === "GET" && path === "/orders") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    return ok(config, { orders: getOrders() });
  }

  const orderMatch = path.match(/^\/orders\/(\d+)$/);
  if (method === "GET" && orderMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const id = Number(orderMatch[1]);
    const order = getOrders().find((item) => item.id === id);
    if (!order) throw fail(config, 404, { message: "not found" });
    return ok(config, { order });
  }

  if (method === "POST" && path === "/orders") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });

    const customerName = String(body.customerName ?? "").trim();
    const customerPhone = normalizeIranianPhone(String(body.customerPhone ?? ""));
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (customerName.length < 2) {
      throw fail(config, 422, { errors: { customerName: "نام مشتری را بنویس" } });
    }
    if (!iranianPhoneRegExp.test(customerPhone)) {
      throw fail(config, 422, { errors: { customerPhone: "شماره درست نیست" } });
    }
    if (rawItems.length === 0) {
      throw fail(config, 422, { errors: { items: "حداقل یک محصول لازم است" } });
    }

    const products = getProducts();
    const items: OrderItem[] = [];
    for (const raw of rawItems) {
      const row = raw as { productId?: number; qty?: number };
      const product = products.find((item) => item.id === Number(row.productId));
      const qty = Number(row.qty ?? 0);
      if (!product || qty < 1) {
        throw fail(config, 422, { errors: { items: "محصول یا تعداد درست نیست" } });
      }
      if ((product.stock ?? 0) < qty) {
        throw fail(config, 422, {
          errors: { items: `موجودی «${product.title}» کافی نیست` },
        });
      }
      items.push({
        productId: product.id,
        title: product.title,
        emoji: product.emoji ?? "📦",
        image: product.image,
        price: product.price,
        qty,
      });
    }

    const nextProducts = products.map((product) => {
      const taken = items.find((item) => item.productId === product.id);
      if (!taken) return product;
      return { ...product, stock: (product.stock ?? 0) - taken.qty };
    });
    saveProducts(nextProducts);

    const orders = getOrders();
    const order = {
      id: nextId(orders),
      customerName,
      customerPhone,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      status: "pending" as OrderStatus,
      note: String(body.note ?? "").trim() || undefined,
      created_at: new Date().toISOString(),
    };
    saveOrders([order, ...orders]);
    return ok(config, { order }, 201);
  }

  const statusMatch = path.match(/^\/orders\/(\d+)\/status$/);
  if (method === "POST" && statusMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const id = Number(statusMatch[1]);
    const next = String(body.status ?? "") as OrderStatus;
    const orders = getOrders();
    const index = orders.findIndex((item) => item.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    const current = orders[index];
    if (!nextStatuses(current.status).includes(next)) {
      throw fail(config, 422, { errors: { status: "این وضعیت مجاز نیست" } });
    }

    if (next === "cancelled") {
      const products = getProducts().map((product) => {
        const restored = current.items.find((item) => item.productId === product.id);
        if (!restored) return product;
        return { ...product, stock: (product.stock ?? 0) + restored.qty };
      });
      saveProducts(products);
    }

    orders[index] = { ...current, status: next };
    saveOrders(orders);
    return ok(config, { order: orders[index] });
  }

  if (method === "POST" && path === "/auth/logout") {
    clearSession();
    return ok(config, { status: "success" });
  }

  return null;
}
