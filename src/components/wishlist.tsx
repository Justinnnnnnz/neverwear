"use client";
import { useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/data";
import { useStoreReady } from "@/store/ready";
import { StoreLoading } from "./store-loading";
import { useShop } from "@/store/shop";
import { ProductCard } from "./product-card";
import { ProductImage } from "./product-image";
import { Dialog } from "./dialog";
import type { Product } from "@/types";
export function Wishlist({ now }: { now: number }) {
  const ready = useStoreReady();
  const wishlist = useShop((s) => s.wishlist);
  const add = useShop((s) => s.add);
  const toggle = useShop((s) => s.toggleWish);
  const [selected, setSelected] = useState<Product | null>(null);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("");
  const products = getProducts().filter((p) => wishlist.includes(p.id));
  if (!ready) return <StoreLoading />;
  return (
    <main className="container section">
      <div className="section-title">
        <h1>心愿单</h1>
        <span>{products.length} 件商品</span>
      </div>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id}>
              <ProductCard product={p} now={now} />
              <button
                className="btn secondary full"
                style={{ marginTop: 12 }}
                onClick={() => {
                  setSelected(p);
                  setColor(0);
                  setSize("");
                }}
              >
                移入购物车
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Your favourites</h2>
          <p className="muted">收藏心动单品，随时回来看看。</p>
          <Link href="/new" className="btn">
            探索新品
          </Link>
        </div>
      )}
      {selected && (
        <Dialog title="选择颜色与尺码" close={() => setSelected(null)}>
          <div className="stack">
            <div className="wish-preview">
              <ProductImage product={selected} color={color} />
            </div>
            <strong>{selected.name}</strong>
            <label>
              颜色
              <select
                className="full"
                value={color}
                onChange={(e) => setColor(Number(e.target.value))}
              >
                {selected.colors.map((c, i) => (
                  <option key={c.name} value={i}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              尺码
              <select
                className="full"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">请选择尺码</option>
                {selected.sizes.map((s) => (
                  <option disabled={selected.soldOutSizes.includes(s)} key={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="btn full"
              disabled={!size}
              onClick={() => {
                add({
                  productId: selected.id,
                  color: selected.colors[color].name,
                  size,
                  qty: 1,
                  addedAt: Date.now(),
                });
                toggle(selected.id);
                setSelected(null);
              }}
            >
              移入购物车
            </button>
          </div>
        </Dialog>
      )}
    </main>
  );
}
