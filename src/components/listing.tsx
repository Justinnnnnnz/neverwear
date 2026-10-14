"use client";
import { useState } from "react";
import Link from "next/link";
import { subcategoryLabel } from "@/lib/subcategories";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";
import { ProductGrid } from "./product-card";
import { Dialog } from "./dialog";
export function Listing({
  title,
  subtitle,
  products,
  now,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  now: number;
}) {
  const query = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  function update(key: string, value: string) {
    const next = new URLSearchParams(query);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${path}?${next}`, { scroll: false });
  }
  const size = query.get("size") ?? "";
  const color = query.get("color") ?? "";
  const max = query.get("max") ?? "";
  const min = query.get("min") ?? "";
  const heel = query.get("heel") ?? "";
  const sub = query.get("subcategory") ?? "";
  const sort = query.get("sort") ?? "";
  let filtered = products.filter(
    (p) =>
      (!size || (p.sizes.includes(size) && !p.soldOutSizes.includes(size))) &&
      (!color || p.colors.some((c) => c.name === color)) &&
      (!min || p.price >= Number(min) * 100) &&
      (!max || p.price <= Number(max) * 100) &&
      (!sub || p.subcategory === sub) &&
      (!heel ||
        (p.heelHeightCm !== undefined &&
          (heel === "flat"
            ? p.heelHeightCm < 2
            : heel === "low"
              ? p.heelHeightCm >= 2 && p.heelHeightCm <= 5
              : heel === "mid"
                ? p.heelHeightCm > 5 && p.heelHeightCm <= 8
                : p.heelHeightCm > 8))),
  );
  filtered = [...filtered].sort((a, b) =>
    sort === "price-asc"
      ? a.price - b.price
      : sort === "price-desc"
        ? b.price - a.price
        : sort === "new"
          ? Number(b.isNew) - Number(a.isNew)
          : 0,
  );
  const fields = (
    <div className="stack filters">
      <div className="between">
        <strong>筛选</strong>
        <button
          className="text-button"
          onClick={() => router.replace(path, { scroll: false })}
        >
          清除全部
        </button>
      </div>
      <label>
        品类
        <select
          value={sub}
          onChange={(e) => update("subcategory", e.target.value)}
        >
          <option value="">全部品类</option>
          {[...new Set(products.map((p) => p.subcategory))].map((s) => (
            <option key={s} value={s}>
              {subcategoryLabel(s)}
            </option>
          ))}
        </select>
      </label>
      <label>
        尺码
        <select value={size} onChange={(e) => update("size", e.target.value)}>
          <option value="">全部尺码</option>
          {[...new Set(products.flatMap((p) => p.sizes))].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        颜色
        <select value={color} onChange={(e) => update("color", e.target.value)}>
          <option value="">全部颜色</option>
          {[
            ...new Set(products.flatMap((p) => p.colors.map((c) => c.name))),
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>价格 CAD</legend>
        <div className="row">
          <input
            aria-label="最低价格"
            type="number"
            min="0"
            value={min}
            placeholder="最低"
            onChange={(e) => update("min", e.target.value)}
          />
          <span>–</span>
          <input
            aria-label="最高价格"
            type="number"
            min="0"
            value={max}
            placeholder="最高"
            onChange={(e) => update("max", e.target.value)}
          />
        </div>
      </fieldset>
      {products.some((p) => p.sizeType === "shoe") && (
        <label>
          跟高
          <select value={heel} onChange={(e) => update("heel", e.target.value)}>
            <option value="">全部跟高</option>
            <option value="flat">平底 · &lt;2 cm</option>
            <option value="low">低跟 · 2–5 cm</option>
            <option value="mid">中跟 · &gt;5–8 cm</option>
            <option value="high">高跟 · &gt;8 cm</option>
          </select>
        </label>
      )}
    </div>
  );
  return (
    <main className="container section">
      <div className="listing-heading">
        <p className="eyebrow muted">THE COLLECTION</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      {path.startsWith("/c/") && (
        <nav
          className="subcategory-columns category-subnav"
          aria-label="品类导航"
        >
          <Link href={path} aria-current={!sub ? "page" : undefined}>
            查看全部 {title}
          </Link>
          {[...new Set(products.map((p) => p.subcategory))].map((slug) => {
            const next = new URLSearchParams(query);
            next.set("subcategory", slug);
            return (
              <Link
                key={slug}
                href={`${path}?${next}`}
                aria-current={sub === slug ? "page" : undefined}
              >
                {subcategoryLabel(slug)}
              </Link>
            );
          })}
        </nav>
      )}
      <div className="listing-toolbar">
        <button
          className="btn secondary mobile-only"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal size={16} /> 筛选
        </button>
        <span aria-live="polite">{filtered.length} 件商品</span>
        <label className="row">
          排序
          <select value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="">推荐</option>
            <option value="new">最新</option>
            <option value="price-asc">价格 ↑</option>
            <option value="price-desc">价格 ↓</option>
          </select>
        </label>
      </div>
      <div className="listing-layout">
        <aside className="desktop-filters">{fields}</aside>
        <div>
          {filtered.length ? (
            <ProductGrid products={filtered} now={now} />
          ) : (
            <div className="empty">
              <h2>暂无符合条件的商品</h2>
              <p className="muted">试试调整筛选条件。</p>
              <button
                className="btn secondary"
                onClick={() => router.replace(path)}
              >
                清除全部
              </button>
            </div>
          )}
        </div>
      </div>
      {open && (
        <Dialog title="筛选商品" close={() => setOpen(false)} sheet>
          {fields}
          <button className="btn full" onClick={() => setOpen(false)}>
            查看 {filtered.length} 件商品
          </button>
        </Dialog>
      )}
    </main>
  );
}
