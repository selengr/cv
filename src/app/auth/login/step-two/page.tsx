"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneVerifyForm from "@/forms/auth/phoneVerifyForm";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectPhoneVerifyToken, updatePhoneVerifyToken } from "@/store/auth";

export default function PhoneVerifyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector(selectPhoneVerifyToken);

  const clearPhoneVerifyToken = () => {
    dispatch(updatePhoneVerifyToken(undefined));
  };

  useEffect(() => {
    if (token === undefined) {
      router.replace("/auth/login");
    }
  }, [router, token]);

  if (token === undefined) return null;

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          تایید شماره موبایل
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <PhoneVerifyForm token={token} clearToken={clearPhoneVerifyToken} />
        </div>
      </div>
    </div>
  );
}
