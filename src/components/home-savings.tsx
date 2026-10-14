"use client";
import Link from "next/link";
import { useShop } from "@/store/shop";
import { monthKey } from "@/lib/sim";
import { formatPrice } from "@/lib/pricing";
export function HomeSavings({ now }: { now: number }) {
  const orders = useShop((s) => s.orders);
  const monthly = orders
    .filter((o) => monthKey(o.createdAt) === monthKey(now))
    .reduce((n, o) => n + o.total, 0);
  return (
    <div className="home-savings">
      <Link href="/report" className="faint">
        本月已省 {formatPrice(monthly)} · 查看月度报告
      </Link>
    </div>
  );
}
