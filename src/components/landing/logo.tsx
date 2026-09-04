"use client";

import Link from "next/link";
import useSWR from "swr";
import { GetShopSettingsPublic } from "@/services/settings";
import { shopInitial } from "@/helpers/shopSettings";

export default function Logo({ light = false }: { light?: boolean }) {
  const { data: settings } = useSWR("shop/settings", GetShopSettingsPublic, {
    revalidateOnFocus: false,
  });
  const name = settings?.name?.trim() || "Shopy";
  const initial = shopInitial(settings);

  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        className={`font-display flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
          light ? "bg-white/15 text-white" : "bg-[#1f4a45] text-[#f4efe6]"
        }`}
      >
        {initial}
      </span>
      <span
        className={`font-display text-[1.15rem] font-semibold tracking-tight ${
          light ? "text-white" : "text-[#14110e]"
        }`}
      >
        {name}
      </span>
    </Link>
  );
}
