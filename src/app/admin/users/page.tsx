import EmptyList from "@/components/shared/emptyList";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900">کاربران</h1>
      <p className="mt-2 text-sm text-gray-600">
        مدیریت نقش‌ها و حساب‌های فروشنده در نسخه‌های بعدی به این صفحه اضافه می‌شود.
      </p>
      <div className="mt-8">
        <EmptyList
          title="هنوز کاربری در لیست نیست"
          description="اتصال به API کاربران و فیلتر نقش‌ها مرحله بعدی توسعه است."
        />
      </div>
    </div>
  );
}
