import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopy — پنل فروشگاه",
  description:
    "Shopy is a phone-first shop admin for small stores: products, users, and a seller panel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
