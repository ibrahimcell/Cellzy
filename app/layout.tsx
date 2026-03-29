import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CELLZY — Your Device, Perfected",
  description:
    "Premium phones, cases & accessories. Expert repair for all models. Shop online or walk in.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1d1d1f] antialiased">{children}</body>
    </html>
  );
}
