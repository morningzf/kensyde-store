import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kensyde.com"),
  title: {
    default: "KENSYDE | Premium Insulated Drinkware for Everyday Life",
    template: "%s | KENSYDE"
  },
  description:
    "Shop KENSYDE premium stainless steel tumblers, insulated bottles, and travel drinkware designed for work, fitness, travel, and outdoor adventures."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
