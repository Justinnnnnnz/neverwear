"use client";
import { createLocalId } from "@/lib/id";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";
import { totals } from "@/lib/pricing";
import type { CartItem, Order, ClosetItem } from "@/types";
interface Shop {
  preferredUnit: "US" | "EU" | "CN";
  setPreferredUnit: (unit: "US" | "EU" | "CN") => void;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  closet: ClosetItem[];
  address: Order["address"];
  toggleWish: (id: string) => void;
  add: (item: CartItem) => void;
  updateItem: (index: number, patch: Partial<CartItem>) => void;
  removeItem: (index: number) => void;
  setAddress: (address: Order["address"]) => void;
  placeOrder: (
    method: Order["shippingMethod"],
    address: Order["address"],
  ) => string | null;
}
export const useShop = create<Shop>()(
  persist(
    (set, get) => ({
      preferredUnit: "US",
      setPreferredUnit: (preferredUnit) => set({ preferredUnit }),
      cart: [],
      wishlist: [],
      orders: [],
      closet: [],
      address: { city: "Toronto", province: "ON" },
      setAddress: (address) => set({ address }),
      updateItem: (index, patch) =>
        set((s) => ({
          cart: s.cart.map((i, n) => (n === index ? { ...i, ...patch } : i)),
        })),
      removeItem: (index) =>
        set((s) => ({ cart: s.cart.filter((_, n) => n !== index) })),
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        })),
      add: (item) =>
        set((s) => {
          const found = s.cart.find(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color,
          );
          return {
            cart: found
              ? s.cart.map((i) =>
                  i === found
                    ? { ...i, qty: Math.min(99, i.qty + item.qty) }
                    : i,
                )
              : [...s.cart, item],
          };
        }),
      placeOrder: (method, address) => {
        const state = get();
        if (!state.cart.length) return null;
        const now = Date.now();
        const date = new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          timeZone: "America/Toronto",
        })
          .format(now)
          .replace("/", "");
        const id = `NW-${date}-${createLocalId().slice(0, 8).toUpperCase()}`;
        const order: Order = {
          id,
          items: state.cart.map((i) => ({ ...i })),
          ...totals(state.cart, method),
          shippingMethod: method,
          address,
          createdAt: now,
        };
        const owned = order.items.flatMap((i) =>
          Array.from({ length: i.qty }, () => ({
            productId: i.productId,
            color: i.color,
            size: i.size,
            orderId: id,
            addedAt: now,
          })),
        );
        set({
          orders: [order, ...state.orders],
          closet: [...owned, ...state.closet],
          cart: [],
          address,
        });
        return id;
      },
    }),
    {
      name: "neverwear-shop",
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
    },
  ),
);
