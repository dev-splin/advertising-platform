import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "광고 플랫폼",
  description: "광고 플랫폼 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
