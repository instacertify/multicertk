"use client";

import { usePathname } from "@/i18n/navigation";

export function HideOnAdminLogin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  if (pathname.includes("/admin")) return null;
  return <>{children}</>;
}
