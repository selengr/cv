import { ADMIN_PERMISSIONS } from "@/helpers/localDb";

export type ShopRole = "admin" | "seller";

export function roleFromPermissions(permissions: string[] = []): ShopRole {
  return permissions.includes("manage_users") ? "admin" : "seller";
}

export function roleLabel(role: ShopRole) {
  return role === "admin" ? "ادمین" : "فروشنده";
}

export function permissionsForRole(role: ShopRole) {
  return role === "admin" ? [...ADMIN_PERMISSIONS] : [];
}
