"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      // Only refresh on actual sign in/out events, not on initial session load
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // Use router.refresh() instead of window.location.reload()
        // This is more efficient and doesn't cause a full page reload
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
};
