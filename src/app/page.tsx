import Link from "next/link";

const features = [
  {
    title: "ورود با موبایل",
    body: "ثبت‌نام و ورود دو مرحله‌ای با شماره ایرانی و کد تایید — مناسب فروشگاه‌های داخل کشور.",
  },
  {
    title: "مدیریت محصول",
    body: "لیست، ساخت، ویرایش و حذف محصول با صفحه‌بندی، دسترسی نقش‌محور و پیام‌های فارسی.",
  },
  {
    title: "پنل فروشنده و ادمین",
    body: "داشبورد ادمین برای کاتالوگ و کاربران، به‌علاوه پنل حساب برای خود فروشنده.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-700">
            Shopy
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link href="/auth/login" className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100">
              ورود
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
            >
              شروع کنید
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold tracking-wide text-indigo-600">commerce OS for small shops</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-slate-900 sm:text-5xl">
          پنل فروشگاهی سبک برای مدیریت محصول، کاربر و حساب فروشنده
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Shopy فرانت‌اند ادمین یک فروشگاه است: احراز هویت با موبایل، کاتالوگ محصول،
          و دسترسی مبتنی بر نقش. نسخه ۲۰۲۶ روی Next.js App Router و استک به‌روز بازنویسی شده.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/auth/register"
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            ساخت حساب
          </Link>
          <Link
            href="/admin"
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            داشبورد ادمین
          </Link>
        </div>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
