"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement | (({ active }: { active: boolean }) => ReactElement);
  href: string;
  className?: string;
}

export default function ActiveLink({ children, href, className }: Props) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href} className={className}>
      {typeof children === "function" ? children({ active }) : children}
    </Link>
  );
}
