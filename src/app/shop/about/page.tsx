import type { Metadata } from "next";
import ShopAboutPage from "@/components/shop/shopAboutPage";

export const metadata: Metadata = {
  title: "درباره ما",
};

export default function ShopAboutRoute() {
  return <ShopAboutPage />;
}
