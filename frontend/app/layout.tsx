'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Layout from "@/src/components/layout/Layout";
import Toast from "@/src/components/ui/Toast";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="ko">
      <body>
        <QueryClientProvider client={queryClient}>
          <Layout>
            {children}
          </Layout>
          <Toast />
        </QueryClientProvider>
      </body>
    </html>
  );
}
