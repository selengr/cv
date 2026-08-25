"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/landing/logo";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import User from "@/models/user";

const links = [
  { href: "/panel", label: "خلاصه", exact: true },
  { href: "/panel/products", label: "محصولات", exact: false },
];

export default function PanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const logout = useLogout();
  const access = new User(user);

  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#14110e]">
      <header className="sticky top-0 z-20 border-b border-[#14110e]/8 bg-[#f4efe6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo />
          <nav className="flex items-center gap-1 overflow-x-auto text-sm">
            {links.map((link) => {
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 whitespace-nowrap ${
                    active ? "bg-[#1f4a45] text-white" : "hover:bg-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {access.canAccess("manage_products") && (
              <Link
                href="/admin/products"
                className="rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-white/80"
              >
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
