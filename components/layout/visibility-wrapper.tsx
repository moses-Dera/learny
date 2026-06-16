"use client";

import { usePathname } from "next/navigation";

export function VisibilityWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define paths where the global header and footer should be HIDDEN.
  // We use startsWith to catch sub-routes (e.g., /dashboard/settings)
  const isHidden = 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") || 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/instructor") || 
    pathname.startsWith("/admin");

  // If we are on any of the routes above, hide the children (Header/Footer)
  if (isHidden) return null;

  return <>{children}</>;
}
