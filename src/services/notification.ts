import callApi from "@/helpers/callApi";
import type { OrderNotification } from "@/helpers/notifications";

export async function GetNotifications() {
  const res = await callApi().get("/notifications");
  return (res.data?.notifications ?? []) as OrderNotification[];
}

export async function MarkNotificationRead(id: number) {
  const res = await callApi().post(`/notifications/${id}/read`);
  return res.data?.notification as OrderNotification;
}

export async function MarkAllNotificationsRead() {
  const res = await callApi().post("/notifications/read-all");
  return (res.data?.notifications ?? []) as OrderNotification[];
}
