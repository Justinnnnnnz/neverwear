"use client";
import { useState } from "react";
import Link from "next/link";
import { useStoreReady } from "@/store/ready";
import { StoreLoading } from "./store-loading";
import { useShop } from "@/store/shop";
import { getProduct } from "@/lib/data";
import { formatPrice } from "@/lib/pricing";
import { trackingStep, dateLabel, monthKey } from "@/lib/sim";
import { useClock } from "@/lib/clock";
import { ProductImage } from "./product-image";
import { PriceSummary } from "./cart";
export const statusLabels = ["已下单", "已出库", "运输中", "等待派送"];
export function OrderDetail({
  id,
  initialNow,
}: {
  id: string;
  initialNow: number;
}) {
  const ready = useStoreReady();
  const orders = useShop((s) => s.orders);
  const order = orders.find((o) => o.id === id);
  const now = useClock(initialNow);
  const [message, setMessage] = useState("");
  async function share() {
    try {
      const data = {
        title: "NEVERWEAR · 订单",
        text: "看看我的冬季新入单品",
        url: location.href,
      };
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(location.href);
        setMessage("链接已复制");
      }
    } catch {
      setMessage("可复制浏览器地址进行分享");
    }
  }
  if (!ready) return <StoreLoading />;
  if (!order)
    return (
      <main className="container section empty">
        <h1>暂未找到这笔订单</h1>
        <p className="muted">请在下单时使用的设备查看。</p>
        <Link href="/orders" className="btn">
          查看我的订单
        </Link>
      </main>
    );
  const step = trackingStep(order.createdAt, now);
  const monthly = orders
    .filter((o) => monthKey(o.createdAt) === monthKey(order.createdAt))
    .reduce((n, o) => n + o.total, 0);
  return (
    <main className="container section order-page">
      <div className="order-thanks stack">
        <h1 className="display">Thank you.</h1>
        <p>订单已确认，我们会在发货后通知你。</p>
        <p className="faint">
          本单省下 {formatPrice(order.total)} · 本月累计 {formatPrice(monthly)}
        </p>
      </div>
      <div className="order-layout">
        <div className="stack">
          <div className="between muted">
            <small>订单 #{order.id}</small>
            <small>{order.items.reduce((n, i) => n + i.qty, 0)} 件商品</small>
          </div>
          <p className="muted">
            <small>
              {new Intl.DateTimeFormat("zh-CN", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "America/Toronto",
              }).format(order.createdAt)}
            </small>
          </p>
          <ol className="timeline">
            {[...statusLabels, "已送达"].map((label, i) => (
              <li
                key={label}
                className={i <= step ? "reached" : ""}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="timeline-dot" />
                <div>
                  <strong>{label}</strong>
                  <p className="muted">
                    {i === 0 ? (
                      "付款成功 · NeverPay •••• 0000"
                    ) : i === 1 ? (
                      "Mississauga 仓库已出库"
                    ) : i === 2 ? (
                      "包裹已到达 Toronto 分拣中心"
                    ) : i === 3 ? (
                      "等待派送"
                    ) : (
                      <>
                        预计 {dateLabel(order.createdAt + 3 * 86400000)} 送达{" "}
                        <span className="faint">*大概率不会</span>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="panel stack">
            <strong>已加入「我的衣柜」</strong>
            <Link className="underlined" href="/closet">
              去搭配一套 →
            </Link>
          </div>
          <div className="row">
            <button className="btn secondary full" onClick={() => void share()}>
              分享
            </button>
            <Link className="btn full" href="/new">
              继续购物
            </Link>
          </div>
          <p role="status">{message}</p>
        </div>
        <aside className="stack">
          <h2>Your Order</h2>
          <ul className="cart-items">
            {order.items.map((i, n) => {
              const p = getProduct(i.productId)!;
              return (
                <li key={n}>
                  <Link href={`/p/${p.slug}`} className="cart-thumbnail">
                    <ProductImage
                      product={p}
                      color={Math.max(
                        0,
                        p.colors.findIndex((c) => c.name === i.color),
                      )}
                    />
                  </Link>
                  <div>
                    <Link href={`/p/${p.slug}`}>{p.name}</Link>
                    <p className="muted">
                      {i.color} · {i.size} · {i.qty} 件
                    </p>
                    <p>{formatPrice(p.price * i.qty)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <PriceSummary items={order.items} method={order.shippingMethod} />
          <p className="muted">
            配送至 {order.address.city || "Toronto"}，
            {order.address.province || "ON"}
          </p>
        </aside>
      </div>
    </main>
  );
}
