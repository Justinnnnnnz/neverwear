"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import type { Product, Review } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { convertShoeSize } from "@/lib/sizes";
import { viewers, dateLabel } from "@/lib/sim";
import { useStoreReady } from "@/store/ready";
import { useShop } from "@/store/shop";
import { ProductImage } from "./product-image";
import { ProductGrid } from "./product-card";
export function PDP({
  product: p,
  reviews,
  related,
  now,
}: {
  product: Product;
  reviews: Review[];
  related: Product[];
  now: number;
}) {
  const ready = useStoreReady();
  const [color, setColor] = useState(0);
  const [size, setSize] = useState("");
  const preferredUnit = useShop((s) => s.preferredUnit);
  const [unitOverride, setUnit] = useState<"US" | "EU" | "CN" | null>(null);
  const unit = unitOverride ?? preferredUnit;
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [slide, setSlide] = useState(0);
  const gallery = useRef<HTMLDivElement>(null);
  const sizes = useRef<HTMLDivElement>(null);
  const add = useShop((s) => s.add);
  const wish = useShop((s) => s.wishlist.includes(p.id));
  const toggle = useShop((s) => s.toggleWish);
  const count = p.images?.[`c${color}`]?.length ?? 2;
  function addToCart() {
    if (!size) {
      setError(true);
      sizes.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sizes.current
        ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus();
      return;
    }
    add({
      productId: p.id,
      color: p.colors[color].name,
      size,
      qty: 1,
      addedAt: Date.now(),
    });
    setAdded(true);
  }
  return (
    <main className="container pdp-main">
      <nav className="breadcrumb" aria-label="面包屑">
        <Link href="/">首页</Link>
        <span>/</span>
        <Link href={`/c/${p.category}`}>{p.category}</Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <div className="pdp-layout">
        <div>
          <div
            className="gallery"
            ref={gallery}
            onScroll={(e) => {
              const el = e.currentTarget;
              setSlide(Math.round(el.scrollLeft / el.clientWidth));
            }}
          >
            {Array.from({ length: count }, (_, i) => (
              <ProductImage
                key={`${color}-${i}`}
                product={p}
                color={color}
                index={i}
                priority={i === 0}
              />
            ))}
          </div>
          <div
            className="gallery-dots mobile-only"
            aria-label={`第 ${slide + 1} 张，共 ${count} 张`}
          >
            {Array.from({ length: count }, (_, i) => (
              <button
                aria-label={`查看第 ${i + 1} 张`}
                aria-pressed={slide === i}
                key={i}
                onClick={() =>
                  gallery.current?.scrollTo({
                    left: i * gallery.current.clientWidth,
                    behavior: "smooth",
                  })
                }
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <div className="pdp-info stack">
          <div className="stack" style={{ gap: 6 }}>
            <p className="eyebrow muted">
              {p.isNew ? "NEW IN" : "THE COLLECTION"} · {p.subcategory}
            </p>
            <h1>{p.name}</h1>
            <p className="display product-subtitle">{p.nameEn}</p>
            <div className="row price">
              <span>{formatPrice(p.price)}</span>
              {p.compareAtPrice && (
                <>
                  <del className="muted">{formatPrice(p.compareAtPrice)}</del>
                  <small className="accent">
                    -{Math.round((1 - p.price / p.compareAtPrice) * 100)}%
                  </small>
                </>
              )}
            </div>
          </div>
          <div>
            <p>颜色：{p.colors[color].name}</p>
            <div className="row swatches">
              {p.colors.map((c, i) => (
                <button
                  aria-label={`颜色：${c.name}`}
                  aria-pressed={color === i}
                  key={c.name}
                  onClick={() => {
                    setColor(i);
                    setAdded(false);
                    setSlide(0);
                    gallery.current?.scrollTo({ left: 0 });
                  }}
                >
                  <span style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>
          <div
            className={`stack size-section ${error ? "shake" : ""}`}
            ref={sizes}
          >
            <div className="between">
              <span>
                尺码{p.sizeType === "shoe" && unit === "CN" ? " · 脚长 mm" : ""}
              </span>
              {p.sizeType === "shoe" && (
                <div className="unit-toggle" role="group" aria-label="鞋码单位">
                  {(["US", "EU", "CN"] as const).map((u) => (
                    <button
                      key={u}
                      aria-pressed={unit === u}
                      onClick={() => setUnit(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
              <Link href="/size-guide" className="underlined">
                尺码表
              </Link>
            </div>
            <div className="size-grid">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  className="size-pill"
                  disabled={p.soldOutSizes.includes(s)}
                  aria-label={`${p.sizeType === "shoe" ? unit + " " : ""}${p.sizeType === "shoe" ? convertShoeSize(s, unit) : s}${p.soldOutSizes.includes(s) ? "，已售罄" : ""}`}
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setError(false);
                    setAdded(false);
                  }}
                >
                  {p.sizeType === "shoe" ? convertShoeSize(s, unit) : s}
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="accent">
                请先选择尺码
              </p>
            )}
            <p className={p.lowStockSizes.includes(size) ? "accent" : "muted"}>
              {p.lowStockSizes.includes(size)
                ? `仅剩 1 ${p.sizeType === "shoe" ? "双" : "件"}！`
                : "有货 · "}
              {viewers(p.id, now)} 人正在看
            </p>
            <div className="panel">
              Fit：{p.fit}
              {p.heelHeightCm && ` · 跟高 ${p.heelHeightCm} cm`}
            </div>
          </div>
          <div>
            <div className="row">
              <button
                className="btn full"
                disabled={!ready}
                onClick={addToCart}
              >
                {added ? (
                  <>
                    <Check size={18} /> 已加入购物车
                  </>
                ) : (
                  "加入购物车"
                )}
              </button>
              <button
                className="btn secondary icon-btn wish-button"
                aria-label="收藏商品"
                aria-pressed={wish}
                disabled={!ready}
                onClick={() => toggle(p.id)}
              >
                <Heart size={22} fill={wish ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="faint" style={{ marginTop: 6 }}>
              模拟购物 · 不会实际扣款
            </p>
            {added && (
              <Link href="/cart" className="underlined">
                查看购物车 →
              </Link>
            )}
          </div>
          <div className="delivery stack">
            <p>满 $150 免运费</p>
            <p>
              预计 {dateLabel(now + 3 * 86400000)} –{" "}
              {dateLabel(now + 6 * 86400000)} 送达
            </p>
            <p>30 天免费退换</p>
          </div>
          <details className="accordion" open>
            <summary>商品详情</summary>
            <p>{p.description}</p>
            <ul>
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </details>
          <section className="reviews stack">
            <div className="between">
              <h2 className="review-heading">评价 {p.rating} / 5</h2>
              <span className="muted">{p.reviewCount} 条评价</span>
            </div>
            <div
              className="fit-scale"
              role="img"
              aria-label="买家反馈：尺码合适"
            >
              <span />
              <div className="between muted">
                <small>偏小</small>
                <small>合适</small>
                <small>偏大</small>
              </div>
            </div>
            {reviews.map((r, i) => (
              <article className="review stack" key={i}>
                <strong>
                  {r.nickname} · {p.sizeType === "shoe" ? "US " : ""}
                  {r.size} · {r.height}cm · 已购
                </strong>
                <span aria-label={`${r.rating} 星`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                <p>{r.text}</p>
              </article>
            ))}
          </section>
        </div>
      </div>
      <section className="section">
        <div className="section-title">
          <h2>You may also like</h2>
          <span>你可能也喜欢</span>
        </div>
        <ProductGrid products={related} now={now} />
      </section>
      <div className="mobile-buy mobile-only">
        <div>
          <small className="muted">
            {size
              ? p.sizeType === "shoe"
                ? `${unit} ${convertShoeSize(size, unit)}`
                : size
              : "请选择尺码"}{" "}
            · {p.colors[color].name}
          </small>
          <p>{formatPrice(p.price)}</p>
        </div>
        <button className="btn" disabled={!ready} onClick={addToCart}>
          {added ? "已加入购物车" : "加入购物车"}
        </button>
      </div>
    </main>
  );
}
