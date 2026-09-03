import callApi from "@/helpers/callApi";
import type ReturnRequest from "@/models/returnRequest";
import type Order from "@/models/order";

export async function GetReturns() {
  const res = await callApi().get("/returns");
  return (res.data?.returns ?? []) as ReturnRequest[];
}

export async function ApproveReturn(id: number, sellerNote?: string) {
  const res = await callApi().post(`/returns/${id}/approve`, { sellerNote });
  return res.data as { return: ReturnRequest; order?: Order };
}

export async function RejectReturn(id: number, sellerNote?: string) {
  const res = await callApi().post(`/returns/${id}/reject`, { sellerNote });
  return res.data?.return as ReturnRequest;
}

export async function RequestShopReturn(values: {
  orderId: number;
  reason: string;
}) {
  const res = await callApi().post("/shop/account/returns", values);
  return res.data?.return as ReturnRequest;
}
