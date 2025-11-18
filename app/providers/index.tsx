"use client";

import { SupabaseProvider } from "./supabase-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseProvider>{children}</SupabaseProvider>
    </ThemeProvider>
  );
}
