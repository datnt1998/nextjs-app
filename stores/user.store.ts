import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Role = "owner" | "admin" | "manager" | "editor" | "viewer";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  tenant_id: string;
  permissions: string[];
}

interface UserState {
  user: User | null;
  role: Role;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        role: "viewer",
        setUser: (user) => set({ user, role: user?.role || "viewer" }),
        clearUser: () => set({ user: null, role: "viewer" }),
      }),
      { name: "user-storage" }
    )
  )
);
