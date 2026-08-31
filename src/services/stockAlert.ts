import callApi from "@/helpers/callApi";
import type { StockAlert } from "@/helpers/stockAlerts";

export async function GetStockAlerts() {
  const res = await callApi().get("/stock-alerts");
  return (res.data?.alerts ?? []) as StockAlert[];
}

export async function MarkStockAlertRead(alertId: number) {
  const res = await callApi().post(`/stock-alerts/${alertId}/read`);
  return res.data?.alert as StockAlert;
}

export async function MarkAllStockAlertsRead() {
  const res = await callApi().post("/stock-alerts/read-all");
  return (res.data?.alerts ?? []) as StockAlert[];
}
