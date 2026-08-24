import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shopy | پنل فروشگاه",
  description: "ورود با موبایل و مدیریت محصول برای فروشگاه‌های کوچک",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={`${vazirmatn.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
