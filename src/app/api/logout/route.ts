import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "success" });

  response.cookies.set("shopy_token", "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
