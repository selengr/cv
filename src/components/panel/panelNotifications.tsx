"use client";

import Link from "next/link";
import useSWR from "swr";
import { toast } from "react-toastify";
import {
  GetNotifications,
  MarkAllNotificationsRead,
  MarkNotificationRead,
} from "@/services/notification";
import LoadingBox from "@/components/shared/loadingBox";
import EmptyList from "@/components/shared/emptyList";
import { formatToman } from "@/helpers/catalog";
import { formatDay } from "@/helpers/orders";

export default function PanelNotifications() {
  const { data, error, mutate, isLoading } = useSWR(
    "notifications",
    GetNotifications,
  );
  const items = data ?? [];
  const unread = items.filter((item) => !item.read);

  const markOne = async (id: number) => {
    await MarkNotificationRead(id);
    await mutate();
  };

  const markAll = async () => {
    await MarkAllNotificationsRead();
    await mutate();
    toast.success("همه اعلان‌ها خوانده شد");
  };

  const enablePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("این مرورگر اعلان سیستم ندارد");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("اعلان مرورگر روشن شد");
      return;
    }
    toast.info("اجازه اعلان داده نشد");
  };

  if (isLoading && !data && !error) return <LoadingBox />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">اعلان سفارش‌ها</h1>
          <p className="mt-2 text-sm text-[#5c564d]">
            وقتی سفارش جدید ثبت شود اینجا می‌آید. می‌توانی webhook هم بگذاری.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={enablePush}
            className="rounded-full px-3 py-1.5 text-sm ring-1 ring-[#14110e]/15"
          >
            اعلان مرورگر
          </button>
          {unread.length > 0 && (
            <button
              type="button"
              onClick={markAll}
              className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-sm text-white"
            >
              همه را خواندم
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyList
            title="اعلانی نیست"
            description="یک سفارش از فروشگاه بزن تا اینجا بیاید"
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-3xl border p-4 shadow-sm ${
                item.read
                  ? "border-[#14110e]/8 bg-white/70"
                  : "border-[#1f4a45]/25 bg-[#1f4a45]/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.message}</p>
                  <p className="mt-1 text-sm text-[#5c564d]">
                    {formatToman(item.total)} · {formatDay(item.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/panel/orders/${item.orderId}`}
                    className="rounded-full px-3 py-1.5 text-sm text-[#1f4a45] ring-1 ring-[#1f4a45]/20"
                  >
                    سفارش
                  </Link>
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => markOne(item.id)}
                      className="rounded-full px-3 py-1.5 text-sm ring-1 ring-[#14110e]/15"
                    >
                      خواندم
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
