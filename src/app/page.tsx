import {
  CubeIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import DashboardPreview from "@/components/landing/dashboardPreview";
import LandingHeader from "@/components/landing/header";
import Logo from "@/components/landing/logo";

const features = [
  {
    icon: DevicePhoneMobileIcon,
    title: "ورود با موبایل",
    body: "شماره ایرانی می‌دهی، کد می‌آید، وارد می‌شوی. رمز جدا لازم نیست.",
  },
  {
    icon: CubeIcon,
    title: "محصولات",
    body: "اضافه کن، ویرایش کن، حذف کن. لیست صفحه‌بندی دارد و فارسی است.",
  },
  {
    icon: ShieldCheckIcon,
    title: "دسترسی نقش‌ها",
    body: "ادمین کاتالوگ را می‌بیند، فروشنده پنل خودش را. هر کس به اندازه نقشش.",
  },
];
// دثص رثقسهخد سشفف
const steps = [
  { n: "۱", title: "حساب بساز", body: "اسم و شماره موبایل کافی است." },
  { n: "۲", title: "کد را بزن", body: "پیامک تایید می‌آید، بعد وارد پنل می‌شوی." },
  { n: "۳", title: "فروشگاه را جمع کن", body: "محصولات را از داشبورد مدیریت کن." },
];

export default function HomePage() {
  return (
    <div className="landing min-h-screen bg-[#f4efe6] text-[#14110e]">
      <LandingHeader />

      <main>
        <section className="relative overflow-hidden">
          <div className="landing-hero-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
            <div>
              <p className="inline-flex rounded-full border border-[#1f4a45]/15 bg-white/60 px-3 py-1 text-xs text-[#1f4a45]">
                پنل پشت‌صحنه فروشگاه
              </p>
              <h1 className="mt-5 max-w-xl text-4xl leading-[1.25] font-bold tracking-tight sm:text-5xl lg:text-[3.25rem]">
                فروشگاهت را از یک پنل ساده جمع و جور نگه دار
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-[#5c564d] sm:text-lg">
                Shopy ویترین نیست. برای کسی است که می‌خواهد محصول اضافه کند،
                موجودی را ببیند و با موبایل وارد حساب شود.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/auth/register"
                  className="rounded-full bg-[#1f4a45] px-6 py-3 text-sm text-white hover:bg-[#173833]"
                >
                  ساخت حساب
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-full border border-[#14110e]/12 bg-white/70 px-6 py-3 text-sm text-[#14110e] hover:bg-white"
                >
                  ورود
                </Link>
              </div>
              <p className="mt-6 text-sm text-[#6b6459]">
                رابط راست‌چین و فارسی. مناسب فروشگاه‌های داخل کشور.
              </p>
            </div>

            <div className="lg:pt-4">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-[#14110e]/8 bg-white/70 p-6 shadow-[0_12px_40px_-24px_rgba(20,17,14,0.35)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1f4a45]/10 text-[#1f4a45]">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#5c564d]">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
          <div className="rounded-[2rem] bg-[#1f4a45] px-6 py-10 text-white sm:px-12 sm:py-14">
            <p className="text-sm text-white/60">سه قدم</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">از شماره تا قفسه</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.n}>
                  <span className="text-3xl font-semibold text-[#e8c56b]">{step.n}</span>
                  <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/70">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pt-4 pb-20 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-[#14110e]/8 bg-white/80 px-6 py-10 sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2 className="text-2xl font-semibold">اگر فروشگاه کوچکی داری، از همین‌جا شروع کن</h2>
              <p className="mt-2 text-sm text-[#5c564d]">
                ثبت‌نام رایگان است. داشبورد بعد از ورود باز می‌شود.
              </p>
            </div>
            <Link
              href="/auth/register"
              className="rounded-full bg-[#1f4a45] px-6 py-3 text-sm text-white hover:bg-[#173833]"
            >
              برویم داخل
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#14110e]/8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
          <Logo />
          <p className="text-sm text-[#6b6459]">پنل ادمین فروشگاه · ۲۰۲۶</p>
        </div>
      </footer>
    </div>
  );
}
