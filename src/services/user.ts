import callApi from "@/helpers/callApi";
import type { ShopRole } from "@/helpers/roles";
import type { UserType } from "@/models/user";

export async function GetUsers() {
  const res = await callApi().get("/users");
  return (res.data?.users ?? []) as Array<UserType & { phone?: string }>;
}

export async function UpdateUserRole(userId: number, role: ShopRole) {
  return await callApi().post(`/users/${userId}/role`, { role });
}
