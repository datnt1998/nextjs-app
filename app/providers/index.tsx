"use client";

import { SupabaseProvider } from "./supabase-provider";
import { TanStackProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseProvider>
        <TanStackProvider>{children}</TanStackProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
