import callApi from "@/helpers/callApi";
import type ShippingMethod from "@/models/shipping";
import type Address from "@/models/address";

export async function GetShopShippingMethods() {
  const res = await callApi().get("/shop/shipping-methods");
  return (res.data?.methods ?? []) as ShippingMethod[];
}

export async function GetShippingMethods() {
  const res = await callApi().get("/shipping-methods");
  return (res.data?.methods ?? []) as ShippingMethod[];
}

export async function UpdateShippingMethod(
  id: number,
  values: {
    fee?: number;
    freeAbove?: number | null;
    active?: boolean;
    title?: string;
    description?: string;
  },
) {
  const res = await callApi().patch(`/shipping-methods/${id}`, values);
  return res.data?.method as ShippingMethod;
}

export async function GetMyAddresses() {
  const res = await callApi().get("/shop/account/addresses");
  return (res.data?.addresses ?? []) as Address[];
}

export async function CreateAddress(values: {
  label?: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  street: string;
  postalCode?: string;
  isDefault?: boolean;
}) {
  const res = await callApi().post("/shop/account/addresses", values);
  return res.data?.address as Address;
}

export async function UpdateAddress(
  id: number,
  values: Partial<{
    label: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    street: string;
    postalCode: string;
    isDefault: boolean;
  }>,
) {
  const res = await callApi().patch(`/shop/account/addresses/${id}`, values);
  return res.data?.address as Address;
}

export async function DeleteAddress(id: number) {
  await callApi().delete(`/shop/account/addresses/${id}`);
}
