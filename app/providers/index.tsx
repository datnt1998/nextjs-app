"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupabaseProvider } from "./supabase-provider";
import { TanStackProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseProvider>
        <TanStackProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </TanStackProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
