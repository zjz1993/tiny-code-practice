"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ReactNode } from "react";

export type NavLinkProps = {
  href: string;
  children: ReactNode;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
};

export function NextNavLink({
  href,
  children,
  exact = true,
  className,
  activeClassName = "text-blue-500 font-semibold",
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className={clsx(className, isActive && activeClassName)}>
      {children}
    </Link>
  );
}
