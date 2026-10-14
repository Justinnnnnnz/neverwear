"use client";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "./dialog";
import { useStoreReady } from "@/store/ready";
import { StoreLoading } from "./store-loading";
import { useShop } from "@/store/shop";
import { safeStorage } from "@/lib/storage";
import { formatPrice } from "@/lib/pricing";
import { trackingStep, monthKey } from "@/lib/sim";
import { useClock } from "@/lib/clock";
import { statusLabels } from "./order";
export function Orders({ initialNow }: { initialNow: number }) {
  const ready = useStoreReady();
  const orders = useShop((s) => s.orders);
  const now = useClock(initialNow);
  if (!ready) return <StoreLoading />;
  return (
    <main className="container section narrow">
      <h1>我的订单</h1>
      {orders.length ? (
        <div className="stack section">
          {orders.map((o) => (
            <Link
              href={`/order/${o.id}`}
              className="order-card stack"
              key={o.id}
            >
              <div className="between">
                <strong>#{o.id}</strong>
                <span>{statusLabels[trackingStep(o.createdAt, now)]}</span>
              </div>
              <div className="between muted">
                <span>
                  {new Intl.DateTimeFormat("zh-CN", {
                    dateStyle: "medium",
                    timeZone: "America/Toronto",
                  }).format(o.createdAt)}{" "}
                  · {o.items.reduce((n, i) => n + i.qty, 0)} 件商品
                </span>
                <span>{formatPrice(o.total)}</span>
              </div>
              <span className="underlined">查看订单与物流 →</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>还没有订单</h2>
          <p className="muted">探索适合日常的衣橱单品。</p>
          <Link className="btn" href="/new">
            选购新品
          </Link>
        </div>
      )}
    </main>
  );
}
export function Account({ now }: { now: number }) {
  const [resetOpen, setResetOpen] = useState(false);
  const preferredUnit = useShop((s) => s.preferredUnit);
  const setPreferredUnit = useShop((s) => s.setPreferredUnit);
  const ready = useStoreReady();
  const orders = useShop((s) => s.orders);
  const monthly = orders
    .filter((o) => monthKey(o.createdAt) === monthKey(now))
    .reduce((n, o) => n + o.total, 0);
  const all = orders.reduce((n, o) => n + o.total, 0);
  function reset() {
    useShop.setState({
      preferredUnit: "US",
      cart: [],
      wishlist: [],
      orders: [],
      closet: [],
      address: { city: "Toronto", province: "ON" },
    });
    [
      "neverwear-shop",
      "neverwear-outfits",
      "neverwear-searches",
      "neverwear-preferences",
    ].forEach((k) => safeStorage.removeItem(k));
    window.location.reload();
  }
  if (!ready) return <StoreLoading />;
  return (
    <main className="container section narrow">
      <p className="eyebrow muted">YOUR NEVERWEAR</p>
      <h1>我的</h1>
      <div className="stats-grid section">
        <div className="panel">
          <span className="muted">本月累计</span>
          <p className="stat-value">{formatPrice(monthly)}</p>
        </div>
        <div className="panel">
          <span className="muted">累计金额</span>
          <p className="stat-value">{formatPrice(all)}</p>
        </div>
        <div className="panel">
          <span className="muted">订单数量</span>
          <p className="stat-value">{orders.length}</p>
        </div>
      </div>
      <nav className="account-links section" aria-label="我的功能">
        {[
          { href: "/orders", title: "我的订单", detail: "查看订单与物流" },
          { href: "/wishlist", title: "心愿单", detail: "收藏的心动单品" },
          { href: "/closet", title: "我的衣柜", detail: "探索你的日常搭配" },
          { href: "/report", title: "月度报告", detail: "查看本月购物记录" },
          { href: "/size-guide", title: "尺码指南", detail: "找到合适的 Fit" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="between">
            <div>
              <strong>{x.title}</strong>
              <p className="muted">{x.detail}</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </nav>
      <section className="section stack">
        <h2>Preferences</h2>
        <p className="muted">配送地区：Canada · 价格币种：CAD</p>
        <label>
          默认鞋码单位
          <select
            className="full"
            value={preferredUnit}
            onChange={(e) =>
              setPreferredUnit(e.target.value as "US" | "EU" | "CN")
            }
          >
            {["US", "EU", "CN"].map((unit) => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <button className="btn secondary" onClick={() => setResetOpen(true)}>
          清除所有数据
        </button>
      </section>
      {resetOpen && (
        <Dialog title="清除所有数据？" close={() => setResetOpen(false)}>
          <div className="stack">
            <p>订单、衣柜、心愿单与偏好将从此设备清除。此操作无法撤销。</p>
            <div className="row">
              <button
                className="btn secondary full"
                onClick={() => setResetOpen(false)}
              >
                取消
              </button>
              <button className="btn full" onClick={reset}>
                确认清除
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </main>
  );
}
