"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/organisms/layout/Footer";
import { Navbar } from "@/components/organisms/layout/Navbar";
import { FloatingActions } from "@/components/organisms/shared/FloatingActions";
import { SmoothScrollProvider } from "@/components/organisms/shared/SmoothScrollProvider";
import type { NavCms } from "@/lib/cms-types";

export function SiteShell({
  children,
  nav,
}: {
  children: ReactNode;
  nav: NavCms;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <Navbar nav={nav} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </SmoothScrollProvider>
  );
}
