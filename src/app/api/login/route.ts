import { NextRequest, NextResponse } from "next/server";
import { cookieOptions } from "@/helpers/auth";

export async function POST(request: NextRequest) {
  let token = "";

  try {
    const body = (await request.json()) as { token?: string };
    token = body.token ?? "";
  } catch {
    token = "";
  }

  if (!token) {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  const response = NextResponse.json({ status: "success" });
  response.cookies.set("shopy_token", token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
