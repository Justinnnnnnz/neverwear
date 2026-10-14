import type { ClosetItem } from "@/types";
export const closetKey = (item: ClosetItem, occurrence: number) =>
  `${item.orderId}:${item.productId}:${item.color}:${item.size}:${occurrence}`;
export function closetEntries(items: ClosetItem[]) {
  const counts = new Map<string, number>();
  return items.map((item) => {
    const base = closetKey(item, 0);
    const occurrence = counts.get(base) ?? 0;
    counts.set(base, occurrence + 1);
    return { item, key: closetKey(item, occurrence) };
  });
}
