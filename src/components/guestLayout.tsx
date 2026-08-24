"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/panel");
    }
  }, [loading, router, user]);

  if (user) {
    return (
      <div className="p-8 text-center text-sm text-[#6b6459]">در حال انتقال به پنل...</div>
    );
  }

  return <div className="w-full">{children}</div>;
}
