import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        isOpen: true,
        isCollapsed: false,
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
        setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      }),
      { name: "sidebar-storage" }
    )
  )
);
