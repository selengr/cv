import { AxiosError, AxiosHeaders } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { iranianPhoneRegExp, normalizeIranianPhone } from "@/helpers/auth";
import { nextStatuses } from "@/helpers/orders";
import { makeAuthority, makeRefId } from "@/helpers/payments";
import { averageRating, clampRating } from "@/helpers/reviews";
import { deliverOtpSms, shouldShowOtpHint } from "@/helpers/sms";
import { permissionsForRole, roleFromPermissions } from "@/helpers/roles";
import type { ShopRole } from "@/helpers/roles";
import type { OrderItem, OrderStatus } from "@/models/order";
import {
  ADMIN_PERMISSIONS,
  clearPendingOtp,
  clearOtpHint,
  clearSession,
  getPendingOtp,
  getProducts,
  getOrders,
  getReviews,
  getSession,
  getStockAlerts,
  getUsers,
  nextId,
  publicUser,
  randomOtp,
  randomToken,
  recordLowStockAlerts,
  saveOtpHint,
  saveOrders,
  savePendingOtp,
  saveProducts,
  saveReviews,
  saveSession,
  saveStockAlerts,
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

export async function handleLocalRequest(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse | null> {
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

    const delivery = await deliverOtpSms(phone, code);
    const showHint = shouldShowOtpHint(delivery.sent);
    if (showHint) saveOtpHint(code);
    else clearOtpHint();

    return ok(config, {
      token,
      debug_code: showHint ? code : undefined,
      sms_sent: delivery.sent,
      sms_provider: delivery.provider,
    });
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
    recordLowStockAlerts([products[index]]);
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

  if (method === "GET" && path === "/shop/products") {
    const reviews = getReviews();
    const products = getProducts().map((product) => {
      const list = reviews.filter((item) => item.productId === product.id);
      return {
        ...product,
        ratingAvg: averageRating(list),
        reviewCount: list.length,
      };
    });
    return ok(config, { products });
  }

  const shopProductMatch = path.match(/^\/shop\/products\/(\d+)$/);
  if (method === "GET" && shopProductMatch) {
    const id = Number(shopProductMatch[1]);
    const product = getProducts().find((item) => item.id === id);
    if (!product) throw fail(config, 404, { message: "not found" });
    const list = getReviews().filter((item) => item.productId === id);
    return ok(config, {
      product: {
        ...product,
        ratingAvg: averageRating(list),
        reviewCount: list.length,
      },
    });
  }

  const shopReviewsMatch = path.match(/^\/shop\/products\/(\d+)\/reviews$/);
  if (method === "GET" && shopReviewsMatch) {
    const id = Number(shopReviewsMatch[1]);
    const product = getProducts().find((item) => item.id === id);
    if (!product) throw fail(config, 404, { message: "not found" });
    const reviews = getReviews()
      .filter((item) => item.productId === id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return ok(config, {
      reviews,
      ratingAvg: averageRating(reviews),
      reviewCount: reviews.length,
    });
  }

  if (method === "POST" && shopReviewsMatch) {
    const id = Number(shopReviewsMatch[1]);
    const product = getProducts().find((item) => item.id === id);
    if (!product) throw fail(config, 404, { message: "not found" });

    const authorName = String(body.authorName ?? "").trim();
    const rating = clampRating(Number(body.rating ?? 0));
    const reviewBody = String(body.body ?? "").trim();

    if (authorName.length < 2) {
      throw fail(config, 422, { errors: { authorName: "نام را بنویس" } });
    }
    if (!Number.isFinite(Number(body.rating)) || Number(body.rating) < 1) {
      throw fail(config, 422, { errors: { rating: "امتیاز ۱ تا ۵ بده" } });
    }
    if (reviewBody.length < 3) {
      throw fail(config, 422, { errors: { body: "نظر کوتاه است" } });
    }

    const reviews = getReviews();
    const review = {
      id: nextId(reviews),
      productId: id,
      authorName,
      rating,
      body: reviewBody,
      created_at: new Date().toISOString(),
    };
    saveReviews([review, ...reviews]);
    return ok(config, { review }, 201);
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

  if (method === "POST" && (path === "/orders" || path === "/shop/orders")) {
    const session = getSession();
    if (path === "/orders" && !session) {
      throw fail(config, 401, { message: "unauthenticated" });
    }

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
    recordLowStockAlerts(nextProducts);

    const paymentMethod =
      String(body.paymentMethod ?? "cod") === "online" ? "online" : "cod";

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
      paymentMethod: paymentMethod as "online" | "cod",
    };
    saveOrders([order, ...orders]);
    return ok(config, { order }, 201);
  }

  const shopOrderMatch = path.match(/^\/shop\/orders\/(\d+)$/);
  if (method === "GET" && shopOrderMatch) {
    const id = Number(shopOrderMatch[1]);
    const order = getOrders().find((item) => item.id === id);
    if (!order) throw fail(config, 404, { message: "not found" });
    return ok(config, { order });
  }

  if (method === "POST" && path === "/shop/orders/track") {
    const orderId = Number(body.orderId);
    const phone = normalizeIranianPhone(String(body.phone ?? ""));
    if (!Number.isFinite(orderId) || orderId < 1) {
      throw fail(config, 422, { errors: { orderId: "شماره سفارش درست نیست" } });
    }
    if (!iranianPhoneRegExp.test(phone)) {
      throw fail(config, 422, { errors: { phone: "شماره موبایل درست نیست" } });
    }
    const order = getOrders().find((item) => item.id === orderId);
    if (!order || order.customerPhone !== phone) {
      throw fail(config, 422, {
        errors: { orderId: "سفارش با این شماره پیدا نشد" },
      });
    }
    return ok(config, { order });
  }

  const paymentRequestMatch = path.match(
    /^\/shop\/orders\/(\d+)\/payment\/request$/,
  );
  if (method === "POST" && paymentRequestMatch) {
    const id = Number(paymentRequestMatch[1]);
    const orders = getOrders();
    const index = orders.findIndex((item) => item.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    const current = orders[index];
    if (current.status === "cancelled") {
      throw fail(config, 422, { errors: { status: "سفارش لغو شده" } });
    }
    if (current.status !== "pending") {
      throw fail(config, 422, { errors: { status: "قبلا پرداخت شده" } });
    }
    const authority = current.authority ?? makeAuthority();
    orders[index] = {
      ...current,
      paymentMethod: "online",
      authority,
    };
    saveOrders(orders);
    return ok(config, {
      authority,
      amount: current.total,
      orderId: current.id,
      redirectUrl: `/shop/gateway/${encodeURIComponent(authority)}`,
    });
  }

  const paymentBindMatch = path.match(
    /^\/shop\/orders\/(\d+)\/payment\/bind$/,
  );
  if (method === "POST" && paymentBindMatch) {
    const id = Number(paymentBindMatch[1]);
    const authority = String(body.authority ?? "").trim();
    if (!authority) {
      throw fail(config, 422, { errors: { authority: "کد تراکنش نیست" } });
    }
    const orders = getOrders();
    const index = orders.findIndex((item) => item.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    const current = orders[index];
    if (current.status !== "pending") {
      throw fail(config, 422, { errors: { status: "قبلا پرداخت شده" } });
    }
    orders[index] = {
      ...current,
      paymentMethod: "online",
      authority,
    };
    saveOrders(orders);
    return ok(config, { order: orders[index] });
  }

  const paymentGetMatch = path.match(/^\/shop\/payments\/([^/]+)$/);
  if (method === "GET" && paymentGetMatch) {
    const authority = decodeURIComponent(paymentGetMatch[1]);
    const order = getOrders().find((item) => item.authority === authority);
    if (!order) throw fail(config, 404, { message: "not found" });
    return ok(config, {
      authority,
      amount: order.total,
      orderId: order.id,
      customerName: order.customerName,
      status: order.status,
      paid: order.status !== "pending" && order.status !== "cancelled",
    });
  }

  if (method === "POST" && path === "/shop/payments/verify") {
    const authority = String(body.Authority ?? body.authority ?? "");
    const status = String(body.Status ?? body.status ?? "").toUpperCase();
    if (!authority) {
      throw fail(config, 422, { errors: { Authority: "کد تراکنش نیست" } });
    }
    const orders = getOrders();
    const index = orders.findIndex((item) => item.authority === authority);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    const current = orders[index];

    if (status !== "OK") {
      return ok(config, {
        verified: false,
        order: current,
        message: "پرداخت لغو یا ناموفق بود",
      });
    }

    if (current.status === "cancelled") {
      throw fail(config, 422, { errors: { status: "سفارش لغو شده" } });
    }

    if (current.status !== "pending") {
      return ok(config, {
        verified: true,
        order: current,
        refId: current.refId,
      });
    }

    const refId = String(body.refId ?? "").trim() || makeRefId();
    orders[index] = {
      ...current,
      status: "paid",
      paymentMethod: "online",
      paid_at: new Date().toISOString(),
      refId,
    };
    saveOrders(orders);
    return ok(config, {
      verified: true,
      order: orders[index],
      refId,
    });
  }

  const payMatch = path.match(/^\/orders\/(\d+)\/pay$/);
  if (method === "POST" && payMatch) {
    const id = Number(payMatch[1]);
    const methodName =
      String(body.method ?? "online") === "cod" ? "cod" : "online";
    const orders = getOrders();
    const index = orders.findIndex((item) => item.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    const current = orders[index];
    if (current.status === "cancelled") {
      throw fail(config, 422, { errors: { status: "سفارش لغو شده" } });
    }
    if (current.status !== "pending") {
      throw fail(config, 422, { errors: { status: "قبلا پرداخت شده" } });
    }
    orders[index] = {
      ...current,
      status: "paid",
      paymentMethod: methodName,
      paid_at: new Date().toISOString(),
      ...(methodName === "online"
        ? {
            authority: current.authority ?? makeAuthority(),
            refId: current.refId ?? makeRefId(),
          }
        : {}),
    };
    saveOrders(orders);
    return ok(config, { order: orders[index] });
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

    orders[index] = {
      ...current,
      status: next,
      ...(next === "paid"
        ? {
            paid_at: current.paid_at ?? new Date().toISOString(),
            paymentMethod: current.paymentMethod ?? "cod",
          }
        : {}),
    };
    saveOrders(orders);
    return ok(config, { order: orders[index] });
  }

  if (method === "GET" && path === "/stock-alerts") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    return ok(config, { alerts: getStockAlerts() });
  }

  const alertReadMatch = path.match(/^\/stock-alerts\/(\d+)\/read$/);
  if (method === "POST" && alertReadMatch) {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const id = Number(alertReadMatch[1]);
    const alerts = getStockAlerts();
    const index = alerts.findIndex((item) => item.id === id);
    if (index < 0) throw fail(config, 404, { message: "not found" });
    alerts[index] = { ...alerts[index], read: true };
    saveStockAlerts(alerts);
    return ok(config, { alert: alerts[index] });
  }

  if (method === "POST" && path === "/stock-alerts/read-all") {
    const session = getSession();
    if (!session) throw fail(config, 401, { message: "unauthenticated" });
    const alerts = getStockAlerts().map((item) => ({ ...item, read: true }));
    saveStockAlerts(alerts);
    return ok(config, { alerts });
  }

  if (method === "POST" && path === "/auth/logout") {
    clearSession();
    return ok(config, { status: "success" });
  }

  return null;
}
