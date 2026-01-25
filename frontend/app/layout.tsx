import type { Metadata } from "next";
import Layout from "@/src/components/layout/Layout";
import Toast from "@/src/components/ui/Toast";
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
      <body>
        <Layout>
          {children}
        </Layout>
        <Toast />
      </body>
    </html>
  );
}
