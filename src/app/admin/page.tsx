import Link from "next/link";

const cards = [
  {
    href: "/admin/orders",
    title: "سفارش‌ها",
    body: "وضعیت را عوض کن، سفارش دستی ثبت کن.",
  },
  {
    href: "/admin/products",
    title: "محصولات",
    body: "کاتالوگ فروشگاه را بساز، ویرایش کن و حذف کن.",
  },
  {
    href: "/admin/users",
    title: "کاربران",
    body: "حساب‌های ادمین و فروشنده را ببین.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-[#14110e]">داشبورد ادمین</h1>
      <p className="mt-2 text-sm text-[#5c564d]">
        سفارش، کاتالوگ و کاربر از اینجا جمع است.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-[#14110e]/8 bg-white p-6 shadow-sm hover:border-[#1f4a45]/30"
          >
            <h2 className="font-display text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-[#5c564d]">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
