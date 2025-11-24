"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseProvider } from "./supabase-provider";
import { TanStackProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";
import { UserProvider } from "./user-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseProvider>
        <UserProvider>
          <TanStackProvider>
            <TooltipProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
              <Toaster richColors />
            </TooltipProvider>
          </TanStackProvider>
        </UserProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
