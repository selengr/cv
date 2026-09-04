import callApi from "@/helpers/callApi";
import type ShopSettings from "@/models/shopSettings";

export async function GetShopSettingsPublic() {
  const res = await callApi().get("/shop/settings");
  return res.data?.settings as ShopSettings;
}

export async function GetShopSettings() {
  const res = await callApi().get("/settings");
  return res.data?.settings as ShopSettings;
}

export async function UpdateShopSettings(values: ShopSettings) {
  const res = await callApi().post("/settings", values);
  return res.data?.settings as ShopSettings;
}
