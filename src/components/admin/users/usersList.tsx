"use client";

import useSWR from "swr";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import { GetUsers } from "@/services/user";

function roleOf(permissions: string[] = []) {
  return permissions.includes("manage_users") ? "ادمین" : "فروشنده";
}

export default function UsersList() {
  const { data, error } = useSWR("admin/users", GetUsers);
  const loading = !data && !error;
  const users = data ?? [];

  if (loading) return <LoadingBox />;
  if (users.length === 0) {
    return (
      <EmptyList
        title="کاربری نیست"
        description="با ثبت‌نام حساب جدید اینجا دیده می‌شود."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#14110e]/8 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[#14110e]/8 text-sm">
        <thead className="bg-[#f4efe6]">
          <tr>
            <th className="px-4 py-3 text-right font-medium">نام</th>
            <th className="px-4 py-3 text-right font-medium">موبایل</th>
            <th className="px-4 py-3 text-right font-medium">نقش</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#14110e]/8">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3" dir="ltr">
                {user.phone ?? "—"}
              </td>
              <td className="px-4 py-3">{roleOf(user.permissions)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
