"use client";

import { Providers } from "@/lib/providers";

export function ClientLayout({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <body className={className}>
      <Providers>{children}</Providers>
    </body>
  );
}