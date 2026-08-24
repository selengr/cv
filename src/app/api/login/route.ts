import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token?: string };
  const response = NextResponse.json({ status: "success" });

  response.cookies.set("shopy_token", body.token ?? "", {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
