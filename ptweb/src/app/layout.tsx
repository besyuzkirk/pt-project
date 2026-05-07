import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PtApp Admin | Yönetici Paneli",
  description: "Personal Trainer ve Üye Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
