"use client";

import LoginForm from "@/forms/auth/loginForm";
import { useAppDispatch } from "@/hooks";
import { savePhoneVerifyToken } from "@/helpers/auth";
import { updatePhoneVerifyToken } from "@/store/auth";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useAppDispatch();

  const setPhoneVerifyToken = (token: string) => {
    savePhoneVerifyToken(token);
    dispatch(updatePhoneVerifyToken(token));
  };

  return (
    <>
      <h1 className="text-center text-3xl font-bold tracking-tight text-[#14110e]">
        ورود
      </h1>
      <p className="mt-2 text-center text-sm text-[#6b6459]">
        شماره موبایل را بزن، کد تایید برایت می‌آید
      </p>
      <div className="mt-8 rounded-3xl border border-[#14110e]/8 bg-white/80 px-5 py-8 shadow-sm sm:px-8">
        <LoginForm setToken={setPhoneVerifyToken} />
        <p className="mt-6 text-center text-sm text-[#6b6459]">
          حساب نداری؟{" "}
          <Link href="/auth/register" className="font-medium text-[#1f4a45]">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </>
  );
}
