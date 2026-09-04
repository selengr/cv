import type { Metadata } from "next";
import ShopContactPage from "@/components/shop/shopContactPage";

export const metadata: Metadata = {
  title: "تماس",
};

export default function ShopContactRoute() {
  return <ShopContactPage />;
}
