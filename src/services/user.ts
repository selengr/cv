import callApi from "@/helpers/callApi";
import type { UserType } from "@/models/user";

export async function GetUsers() {
  const res = await callApi().get("/users");
  return (res.data?.users ?? []) as Array<UserType & { phone?: string }>;
}
