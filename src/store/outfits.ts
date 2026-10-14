"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";
import type { Outfit } from "@/types";
interface Outfits {
  outfits: Outfit[];
  save: (outfit: Outfit) => void;
  remove: (id: string) => void;
}
export const useOutfits = create<Outfits>()(
  persist(
    (set) => ({
      outfits: [],
      save: (outfit) =>
        set((s) => ({
          outfits: [outfit, ...s.outfits.filter((o) => o.id !== outfit.id)],
        })),
      remove: (id) =>
        set((s) => ({ outfits: s.outfits.filter((o) => o.id !== id) })),
    }),
    {
      name: "neverwear-outfits",
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
    },
  ),
);
