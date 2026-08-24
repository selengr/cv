"use client";

import { useAppSelector } from "@/hooks";
import { selectUser } from "@/store/auth";
import useLogout from "@/hooks/useLogout";

export default function UserInfo() {
  const user = useAppSelector(selectUser);
  const logout = useLogout();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">حساب کاربری</p>
      <h2 className="mt-1 text-2xl font-bold text-gray-900">{user.name ?? "کاربر"}</h2>
      <button
        onClick={() => logout("/")}
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        خروج
      </button>
    </div>
  );
}
