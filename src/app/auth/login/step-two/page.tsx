"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneVerifyForm from "@/forms/auth/phoneVerifyForm";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { readPhoneVerifyToken } from "@/helpers/auth";
import { selectPhoneVerifyToken, updatePhoneVerifyToken } from "@/store/auth";

export default function PhoneVerifyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector(selectPhoneVerifyToken);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      const saved = readPhoneVerifyToken();
      if (saved) dispatch(updatePhoneVerifyToken(saved));
    }
    setReady(true);
  }, [dispatch, token]);

  useEffect(() => {
    if (!ready) return;
    if (!token && !readPhoneVerifyToken()) {
      router.replace("/auth/login");
    }
  }, [ready, router, token]);

  if (!ready || !token) {
    return (
      <p className="py-16 text-center text-sm text-[#6b6459]">در حال آماده‌سازی...</p>
    );
  }

  return (
    <>
      <h1 className="text-center text-3xl font-bold tracking-tight text-[#14110e]">
        کد تایید
      </h1>
      <p className="mt-2 text-center text-sm text-[#6b6459]">
        کدی که پیامک شد را وارد کن
      </p>
      <div className="mt-8 rounded-3xl border border-[#14110e]/8 bg-white/80 px-5 py-8 shadow-sm sm:px-8">
        <PhoneVerifyForm token={token} />
        <p className="mt-6 text-center text-sm text-[#6b6459]">
          شماره اشتباه بود؟{" "}
          <Link href="/auth/login" className="font-medium text-[#1f4a45]">
            برگشت به ورود
          </Link>
        </p>
      </div>
    </>
  );
}
