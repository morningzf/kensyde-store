import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginClient } from "@/components/AdminLoginClient";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "KENSYDE 管理后台",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (isAdminAuthenticated()) {
    redirect("/admin");
  }

  return <AdminLoginClient />;
}
