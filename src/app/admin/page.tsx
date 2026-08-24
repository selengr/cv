import Link from "next/link";

const cards = [
  {
    href: "/admin/products",
    title: "محصولات",
    body: "کاتالوگ فروشگاه را بسازید، ویرایش کنید و حذف کنید.",
  },
  {
    href: "/admin/users",
    title: "کاربران",
    body: "دسترسی نقش‌ها و حساب‌های فروشنده را مدیریت کنید.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">داشبورد ادمین</h1>
      <p className="mt-2 text-sm text-gray-600">
        از اینجا کاتالوگ، کاربران و حساب فروشگاه را مدیریت کنید.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-indigo-200"
          >
            <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
