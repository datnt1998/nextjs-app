import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TableState {
  density: "compact" | "comfortable" | "spacious";
  setDensity: (density: "compact" | "comfortable" | "spacious") => void;
}

export const useTableStore = create<TableState>()(
  devtools(
    immer((set) => ({
      density: "comfortable",
      setDensity: (density) =>
        set((state) => {
          state.density = density;
        }),
    }))
  )
);
