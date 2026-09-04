import type ShopSettings from "@/models/shopSettings";

export function defaultShopSettings(): ShopSettings {
  return {
    name: "Shopy",
    tagline: "فروشگاه کوچک، سفارش آنلاین",
    phone: "02191000000",
    instagram: "shopy.shop",
    address: "تهران",
    invoiceFooter: "از خریدت ممنونیم. سوالی داشتی با همین شماره تماس بگیر.",
  };
}

export function shopInitial(settings?: ShopSettings | null) {
  const name = settings?.name?.trim() || "Shopy";
  return name.charAt(0) || "ش";
}
