"use client";

import LoginForm from "@/forms/auth/loginForm";
import { useAppDispatch } from "@/hooks";
import { updatePhoneVerifyToken } from "@/store/auth";
import Link from "next/link";

export default function LoginPage() {
  const dispatch = useAppDispatch();

  const setPhoneVerifyToken = (token: string) => {
    dispatch(updatePhoneVerifyToken(token));
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          ورود به Shopy
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <LoginForm setToken={setPhoneVerifyToken} />
          <p className="mt-6 text-center text-sm text-gray-600">
            حساب ندارید؟{" "}
            <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              ثبت‌نام
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
