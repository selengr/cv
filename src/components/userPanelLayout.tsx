"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
}

export default function UserPanelLayout({ children }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return <div className="p-8 text-sm text-[#6b6459]">در حال بررسی ورود...</div>;
  }

  if (!user) {
    return <div className="p-8 text-sm text-[#6b6459]">در حال انتقال...</div>;
  }

  return <div className="w-full">{children}</div>;
}
