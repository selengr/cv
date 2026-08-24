import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api";

async function proxy(
  request: NextRequest,
  path: string[],
) {
  const target = `${API_BASE.replace(/\/$/, "")}/${path.join("/")}${request.nextUrl.search}`;
  const token = request.cookies.get("shopy_token")?.value;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("accept", request.headers.get("accept") ?? "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const res = await fetch(target, init);
    const body = await res.arrayBuffer();
    const responseHeaders = new Headers();
    const resType = res.headers.get("content-type");
    if (resType) responseHeaders.set("content-type", resType);

    return new NextResponse(body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { message: "سرور در دسترس نیست" },
      { status: 502 },
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path);
}
