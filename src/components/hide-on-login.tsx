"use client";

import { usePathname } from "@/i18n/navigation";

export function HideOnAdminLogin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  if (pathname.includes("/admin/login")) return null;
  return <>{children}</>;
}
