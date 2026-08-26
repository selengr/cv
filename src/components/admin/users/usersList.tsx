"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import { GetUsers, UpdateUserRole } from "@/services/user";
import {
  roleFromPermissions,
  roleLabel,
  type ShopRole,
} from "@/helpers/roles";
import useAuth from "@/hooks/useAuth";
import ValidationError from "@/exceptions/validationError";

export default function UsersList() {
  const { user: me, mutate: mutateMe } = useAuth();
  const { data, error, mutate } = useSWR("admin/users", GetUsers);
  const [busyId, setBusyId] = useState<number | null>(null);
  const loading = !data && !error;
  const users = data ?? [];

  const changeRole = async (userId: number, role: ShopRole) => {
    setBusyId(userId);
    try {
      await UpdateUserRole(userId, role);
      await mutate();
      if (me?.id === userId) await mutateMe();
      toast.success(`نقش شد ${roleLabel(role)}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const first = Object.values(err.messages)[0];
        const message = Array.isArray(first) ? first[0] : first;
        toast.error(String(message ?? "نقش عوض نشد"));
        return;
      }
      toast.error("نقش عوض نشد");
    } finally {
      setBusyId(null);
    }
  };

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
            <th className="px-4 py-3 text-right font-medium">تغییر</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#14110e]/8">
          {users.map((user) => {
            const role = roleFromPermissions(user.permissions);
            const busy = busyId === user.id;
            return (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  {user.name}
                  {me?.id === user.id && (
                    <span className="mr-2 text-xs text-[#6b6459]">(تو)</span>
                  )}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {user.phone ?? "—"}
                </td>
                <td className="px-4 py-3">{roleLabel(role)}</td>
                <td className="px-4 py-3">
                  <select
                    value={role}
                    disabled={busy}
                    onChange={(event) =>
                      changeRole(user.id, event.target.value as ShopRole)
                    }
                    className="rounded-full border border-[#14110e]/12 bg-[#f4efe6] px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    <option value="seller">فروشنده</option>
                    <option value="admin">ادمین</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
