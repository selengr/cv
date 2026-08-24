import { NextResponse } from "next/server";
import { cookieOptions } from "@/helpers/auth";

export async function POST() {
  const response = NextResponse.json({ status: "success" });

  response.cookies.set("shopy_token", "", {
    ...cookieOptions,
    maxAge: 0,
  });

  return response;
}
