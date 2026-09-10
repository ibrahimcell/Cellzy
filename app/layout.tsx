import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CELLZY — Phones, Accessories & Repairs",
  description: "Phones, accessories and fast repairs for iPhone, Samsung, Motorola and more. Reserve your repair with Cellzy.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
