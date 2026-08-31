"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhoneVerifyForm from "@/forms/auth/phoneVerifyForm";
import { useAppSelector } from "@/hooks";
import { readPhoneVerifyToken } from "@/helpers/auth";
import { readOtpHint } from "@/helpers/localDb";
import { selectPhoneVerifyToken } from "@/store/auth";

const emptySubscribe = () => () => undefined;

export default function PhoneVerifyPage() {
  const router = useRouter();
  const reduxToken = useAppSelector(selectPhoneVerifyToken);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const storedToken = useSyncExternalStore(
    emptySubscribe,
    readPhoneVerifyToken,
    () => null,
  );
  const otpHint = useSyncExternalStore(emptySubscribe, readOtpHint, () => null);
  const token = reduxToken || (mounted ? storedToken : undefined) || undefined;

  useEffect(() => {
    if (!mounted) return;
    if (!token) router.replace("/auth/login");
  }, [mounted, router, token]);

  if (!mounted || !token) {
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
        {otpHint
          ? "کدی که ساخته شد را وارد کن"
          : "کد پیامک‌شده را وارد کن"}
      </p>
      {otpHint && (
        <p className="mt-3 rounded-full bg-[#1f4a45]/10 px-4 py-2 text-center text-sm text-[#1f4a45]">
          کد تست: {otpHint}
        </p>
      )}
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
