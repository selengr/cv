"use client";

import Link from "next/link";
import Logo from "@/components/landing/logo";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import User from "@/models/user";

export default function PanelShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const logout = useLogout();
  const access = new User(user);

  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#14110e]">
      <header className="sticky top-0 z-20 border-b border-[#14110e]/8 bg-[#f4efe6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo />
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/panel" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              خلاصه
            </Link>
            <Link href="/panel/products" className="rounded-full px-3 py-1.5 hover:bg-white/80">
              محصولات
            </Link>
            {access.canAccess("manage_products") && (
              <Link href="/admin/products" className="rounded-full px-3 py-1.5 hover:bg-white/80">
                مدیریت
              </Link>
            )}
            <button
              type="button"
              onClick={() => logout("/")}
              className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-white"
            >
              خروج
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
