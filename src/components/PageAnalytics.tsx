"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PageAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      trackEvent({ eventType: "page_view", path: pathname });
    }
  }, [pathname]);

  return null;
}
