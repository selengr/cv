import type { Metadata } from "next";
import LandingPage from "@/components/landing/landingPage";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین کوچک",
  description:
    "پنل فروشنده و فروشگاه عمومی برای فروشگاه‌های کوچک — ورود با موبایل، سفارش، ارسال و پیگیری",
  openGraph: {
    title: "Shopy | فروشگاه آنلاین کوچک",
    description: "پنل فروشنده و فروشگاه عمومی برای فروشگاه‌های کوچک",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
