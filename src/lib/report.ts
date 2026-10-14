import type { Order } from "@/types";
import { getProduct, categories } from "./data";
import { monthKey } from "./sim";
export function monthlyReport(orders: Order[], month: string) {
  const selected = orders.filter((o) => monthKey(o.createdAt) === month);
  const colors: Record<string, number> = {};
  const cats: Record<string, number> = {};
  let items = 0;
  selected.forEach((o) =>
    o.items.forEach((i) => {
      items += i.qty;
      colors[i.color] = (colors[i.color] ?? 0) + i.qty;
      const category = getProduct(i.productId)?.category;
      if (category) cats[category] = (cats[category] ?? 0) + i.qty;
    }),
  );
  const top = (values: Record<string, number>) =>
    Object.entries(values).sort((a, b) => b[1] - a[1])[0]?.[0];
  const timeParts = (t: number) => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "America/Toronto",
    }).format(t);
    const [h, m] = parts.split(":").map(Number);
    return { parts, rank: ((h + 18) % 24) * 60 + m };
  };
  const latest = selected
    .map((o) => timeParts(o.createdAt))
    .sort((a, b) => b.rank - a.rank)[0]?.parts;
  return {
    orders: selected.length,
    items,
    saved: selected.reduce((n, o) => n + o.total, 0),
    category: categories.find((c) => c.slug === top(cats))?.name ?? "待发现",
    color: top(colors) ?? "待发现",
    latest: latest ?? "—",
  };
}
