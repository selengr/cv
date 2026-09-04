import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "@fontsource-variable/estedad/wght.css";
import Providers from "./providers";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Shopy | پنل فروشگاه",
    template: "%s | Shopy",
  },
  description:
    "ورود با موبایل، کاتالوگ و سفارش برای فروشگاه‌های کوچک — پنل فروشنده و فروشگاه عمومی",
  openGraph: {
    title: "Shopy | پنل فروشگاه",
    description: "فروشگاه کوچک با پنل فروشنده و خرید آنلاین",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={plex.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
