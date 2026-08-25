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
  title: "Shopy | پنل فروشگاه",
  description: "ورود با موبایل و مدیریت محصول برای فروشگاه‌های کوچک",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={plex.variable}>
      <body className={`${plex.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
