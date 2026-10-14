"use client";
import { useSyncExternalStore } from "react";
let ready = false;
const listeners = new Set<() => void>();
export function finishStoreHydration() {
  ready = true;
  listeners.forEach((notify) => notify());
}
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
};
export const useStoreReady = () =>
  useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
