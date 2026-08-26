import PermissionGuard from "@/components/permissionGuard";
import UsersList from "@/components/admin/users/usersList";

export default function UsersPage() {
  return (
    <PermissionGuard permission="manage_users">
      <div>
        <h1 className="font-display text-2xl font-semibold">کاربران</h1>
        <p className="mt-2 text-sm text-[#5c564d]">
          نقش را عوض کن. ادمین دمو: ۰۹۱۲۱۱۱۱۱۱۱ — حداقل یک ادمین باید بماند.
        </p>
        <div className="mt-6">
          <UsersList />
        </div>
      </div>
    </PermissionGuard>
  );
}
