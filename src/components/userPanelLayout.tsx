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
  const { error, loading } = useAuth();

  useEffect(() => {
    if (!loading && error) {
      router.replace("/auth/login");
    }
  }, [error, loading, router]);

  if (loading) return <h1 className="p-8 text-lg">Loading ...</h1>;
  if (error) return <span className="p-8 text-sm">در حال انتقال...</span>;

  return <div className="w-full">{children}</div>;
}
