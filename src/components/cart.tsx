"use client";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStoreReady } from "@/store/ready";
import { useShop } from "@/store/shop";
import { getProduct } from "@/lib/data";
import { formatPrice, totals } from "@/lib/pricing";
import { ProductImage } from "./product-image";
import type { CartItem } from "@/types";
export function PriceSummary({
  items,
  method = "standard",
}: {
  items: CartItem[];
  method?: "standard" | "express";
}) {
  const t = totals(items, method);
  return (
    <dl className="price-summary">
      <dt>小计</dt>
      <dd>{formatPrice(t.subtotal)}</dd>
      <dt>运费</dt>
      <dd>{t.shipping === 0 ? "免费" : formatPrice(t.shipping)}</dd>
      <dt>HST 13%</dt>
      <dd>{formatPrice(t.tax)}</dd>
      <dt className="total">合计</dt>
      <dd className="total">{formatPrice(t.total)}</dd>
    </dl>
  );
}
export function NeverPay() {
  return (
    <div className="payment-card row">
      <span className="nw-card">NW</span>
      <div>
        <p>NeverPay •••• 0000</p>
        <small className="muted">默认付款方式</small>
      </div>
    </div>
  );
}
export function Cart({
  drawer = false,
  close,
}: {
  drawer?: boolean;
  close?: () => void;
}) {
  const ready = useStoreReady();
  const cart = useShop((s) => s.cart);
  const update = useShop((s) => s.updateItem);
  const remove = useShop((s) => s.removeItem);
  const t = totals(cart);
  if (!ready)
    return (
      <p className="container section muted" role="status">
        正在载入购物车…
      </p>
    );
  return (
    <div className={drawer ? "stack" : "container section cart-page"}>
      {!drawer && <h1>购物车（{cart.reduce((n, i) => n + i.qty, 0)}）</h1>}
      {!cart.length ? (
        <div className="empty">
          <h2>Your next favourite</h2>
          <p className="muted">购物车还是空的，去发现心动单品。</p>
          <Link href="/new" className="btn" onClick={close}>
            选购新品
          </Link>
        </div>
      ) : (
        <div className={drawer ? "stack" : "cart-layout"}>
          <div className="stack">
            <div className="gift">
              <p>
                {t.subtotal >= 30000 ? (
                  "已获赠限量帆布托特包"
                ) : (
                  <>
                    再买{" "}
                    <strong className="accent">
                      {formatPrice(30000 - t.subtotal)}
                    </strong>{" "}
                    即可获赠限量帆布托特包
                  </>
                )}
              </p>
              <div className="progress">
                <span
                  style={{ width: `${Math.min(100, t.subtotal / 300)}%` }}
                />
              </div>
            </div>
            <p className="panel cart-note">
              购物车商品不保留库存，热门尺码可能随时售罄
            </p>
            <ul className="cart-items">
              {cart.map((i, n) => {
                const p = getProduct(i.productId);
                if (!p) return null;
                return (
                  <li key={`${i.productId}-${i.color}-${i.size}-${n}`}>
                    <Link
                      href={`/p/${p.slug}`}
                      className="cart-thumbnail"
                      onClick={close}
                    >
                      <ProductImage
                        product={p}
                        color={Math.max(
                          0,
                          p.colors.findIndex((c) => c.name === i.color),
                        )}
                      />
                    </Link>
                    <div className="stack cart-item-info">
                      <div className="between">
                        <Link href={`/p/${p.slug}`} onClick={close}>
                          {p.name}
                        </Link>
                        <span>{formatPrice(p.price * i.qty)}</span>
                      </div>
                      <p className="muted">
                        {i.color} · {p.sizeType === "shoe" ? "US " : ""}
                        {i.size}
                      </p>
                      <div className="between">
                        <label className="row muted">
                          尺码
                          <select
                            aria-label={`${p.name}尺码`}
                            value={i.size}
                            onChange={(e) =>
                              update(n, { size: e.target.value })
                            }
                          >
                            {p.sizes.map((s) => (
                              <option
                                key={s}
                                disabled={p.soldOutSizes.includes(s)}
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          className="icon-btn"
                          aria-label={`移除${p.name}`}
                          onClick={() => remove(n)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {p.lowStockSizes.includes(i.size) && (
                        <small className="accent">
                          仅剩 1 {p.sizeType === "shoe" ? "双" : "件"}
                        </small>
                      )}
                      <div className="quantity">
                        <button
                          aria-label={`减少${p.name}数量`}
                          disabled={i.qty <= 1}
                          onClick={() => update(n, { qty: i.qty - 1 })}
                        >
                          <Minus size={14} />
                        </button>
                        <output aria-label="数量">{i.qty}</output>
                        <button
                          aria-label={`增加${p.name}数量`}
                          disabled={i.qty >= 99}
                          onClick={() => update(n, { qty: i.qty + 1 })}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <aside className="cart-summary stack">
            <h2>Order Summary</h2>
            <PriceSummary items={cart} />
            <NeverPay />
            <div className="cart-checkout-action stack">
              <div className="between mobile-only">
                <strong>合计</strong>
                <strong>{formatPrice(t.total)}</strong>
              </div>
              <Link href="/checkout" onClick={close} className="btn full">
                去结算
              </Link>
              <p className="faint" style={{ textAlign: "center" }}>
                模拟支付，不会实际扣款
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
