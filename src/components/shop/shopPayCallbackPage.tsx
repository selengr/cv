"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ShopShell from "@/components/shop/shopShell";
import LoadingBox from "@/components/shared/loadingBox";
import { VerifyShopPayment } from "@/services/payment";
import { formatToman } from "@/helpers/catalog";
import type Order from "@/models/order";

function CallbackBody() {
  const search = useSearchParams();
  const authority = search.get("Authority") ?? "";
  const status = search.get("Status") ?? "NOK";
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [refId, setRefId] = useState<string | undefined>();
  const [message, setMessage] = useState("در حال تایید...");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!authority) {
        if (alive) {
          setMessage("کد تراکنش نیست");
          setLoading(false);
        }
        return;
      }
      try {
        const result = await VerifyShopPayment({
          Authority: authority,
          Status: status,
        });
        if (!alive) return;
        setVerified(result.verified);
        setOrder(result.order);
        setRefId(result.refId);
        setMessage(
          result.verified
            ? "پرداخت با موفقیت تایید شد"
            : result.message ?? "پرداخت تایید نشد",
        );
      } catch {
        if (alive) setMessage("تایید پرداخت نشد");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authority, status]);

  if (loading) {
    return <LoadingBox />;
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1
        className={`font-display text-3xl font-semibold ${
          verified ? "text-emerald-800" : "text-[#14110e]"
        }`}
      >
        {verified ? "پرداخت موفق" : "پرداخت ناتمام"}
      </h1>
      <p className="mt-2 text-sm text-[#5c564d]">{message}</p>

      {order && (
        <div className="mt-6 rounded-3xl border border-[#14110e]/8 bg-white/85 p-5 shadow-sm">
          <p className="text-sm text-[#5c564d]">
            سفارش #{order.id.toLocaleString("fa-IR")} · {order.customerName}
          </p>
          <p className="font-display mt-2 text-2xl font-semibold">
            {formatToman(order.total)}
          </p>
          {refId && (
            <p className="mt-3 text-sm" dir="ltr">
              RefID: {refId}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {verified && (
          <Link
            href="/shop/track"
            className="inline-flex rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
          >
            پیگیری سفارش
          </Link>
        )}
        {!verified && order && (
          <Link
            href={`/shop/pay/${order.id}`}
            className="inline-flex rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
          >
            تلاش دوباره
          </Link>
        )}
        <Link
          href="/shop"
          className="inline-flex rounded-full px-4 py-2 text-sm ring-1 ring-[#14110e]/15"
        >
          فروشگاه
        </Link>
      </div>
    </div>
  );
}

export default function ShopPayCallbackPage() {
  return (
    <ShopShell>
      <Suspense fallback={<LoadingBox />}>
        <CallbackBody />
      </Suspense>
    </ShopShell>
  );
}
