"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import LoadingBox from "@/components/shared/loadingBox";
import { GetShopPayment } from "@/services/payment";
import { callbackPath } from "@/helpers/payments";
import { formatToman } from "@/helpers/catalog";

export default function ShopGatewayPage({
  params,
}: {
  params: Promise<{ authority: string }>;
}) {
  const { authority: raw } = use(params);
  const authority = decodeURIComponent(raw);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    { url: `/shop/gateway/${authority}`, authority },
    ({ authority: id }) => GetShopPayment(id),
  );
  const [card, setCard] = useState("6037 9918 1234 5678");
  const [busy, setBusy] = useState(false);

  const finish = (status: "OK" | "NOK") => {
    setBusy(true);
    router.replace(callbackPath(authority, status));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f2f2c] text-white">
        <LoadingBox />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f2f2c] px-5 text-center text-white">
        <p className="text-sm text-white/70">تراکنش پیدا نشد.</p>
        <button
          type="button"
          onClick={() => router.replace("/shop")}
          className="mt-4 text-sm underline"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  if (data.paid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f2f2c] px-5 text-center text-white">
        <p className="font-display text-xl">این پرداخت قبلا انجام شده</p>
        <button
          type="button"
          onClick={() => finish("OK")}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm text-[#0f2f2c]"
        >
          مشاهده نتیجه
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0f2f2c_0%,#1f4a45_45%,#143832_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <p className="text-xs tracking-wide text-white/60">ShopyPay · درگاه آزمایشی</p>
        <h1 className="font-display mt-2 text-3xl font-semibold">پرداخت امن</h1>
        <p className="mt-2 text-sm text-white/70">
          سفارش #{data.orderId.toLocaleString("fa-IR")} · {data.customerName}
        </p>

        <div className="mt-8 rounded-3xl bg-white/10 p-5 shadow-lg ring-1 ring-white/15 backdrop-blur">
          <p className="text-sm text-white/70">مبلغ قابل پرداخت</p>
          <p className="font-display mt-1 text-3xl font-semibold">
            {formatToman(data.amount)}
          </p>

          <label className="mt-6 block text-sm text-white/80">
            شماره کارت
            <input
              value={card}
              onChange={(event) => setCard(event.target.value)}
              dir="ltr"
              className="mt-1 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-white/50"
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              placeholder="MM/YY"
              defaultValue="12/28"
              dir="ltr"
              className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"
            />
            <input
              placeholder="CVV2"
              defaultValue="123"
              dir="ltr"
              className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <button
            type="button"
            disabled={busy || card.replace(/\s/g, "").length < 16}
            onClick={() => finish("OK")}
            className="mt-5 w-full rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#0f2f2c] disabled:opacity-50"
          >
            {busy ? "در حال انتقال..." : "پرداخت موفق (دمو)"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => finish("NOK")}
            className="mt-3 w-full rounded-full px-4 py-2.5 text-sm text-white/80 ring-1 ring-white/25 disabled:opacity-50"
          >
            انصراف از پرداخت
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-white/45" dir="ltr">
          Authority: {authority.slice(0, 18)}…
        </p>
      </div>
    </div>
  );
}
