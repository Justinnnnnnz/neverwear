"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Plus, Download } from "lucide-react";
import { useStoreReady } from "@/store/ready";
import { StoreLoading } from "./store-loading";
import { useShop } from "@/store/shop";
import { useOutfits } from "@/store/outfits";
import { categories, getProduct } from "@/lib/data";
import { exportImage } from "@/lib/export-image";
import { closetEntries } from "@/lib/closet";
import type { ClosetItem, Outfit } from "@/types";
import { ProductImage } from "./product-image";
import { Dialog } from "./dialog";
const slotLabels = { outer: "外套", top: "上衣", bottom: "下装", shoes: "鞋" };
type Slot = keyof Outfit["slots"];
function itemSlot(i: ClosetItem): Slot {
  const c = getProduct(i.productId)?.category;
  return c === "outerwear"
    ? "outer"
    : c === "tops"
      ? "top"
      : c === "pants" || c === "skirts-dresses"
        ? "bottom"
        : "shoes";
}
export function Closet() {
  const ready = useStoreReady();
  const items = useShop((s) => s.closet);
  const outfits = useOutfits((s) => s.outfits);
  const save = useOutfits((s) => s.save);
  const remove = useOutfits((s) => s.remove);
  const [category, setCategory] = useState("");
  const [slots, setSlots] = useState<Outfit["slots"]>({});
  const [picker, setPicker] = useState<Slot | null>(null);
  const [name, setName] = useState("我的日常搭配");
  const [editing, setEditing] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    useOutfits.persist.rehydrate();
  }, []);
  const owned = closetEntries(items);
  function choose(slot: Slot, key: string) {
    const found = owned.find((o) => o.key === key);
    if (found && itemSlot(found.item) === slot) {
      setSlots((s) => ({ ...s, [slot]: key }));
      setPicker(null);
      setStatus("");
    }
  }
  async function download() {
    if (!exportRef.current) return;
    setBusy(true);
    try {
      await exportImage(exportRef.current, "neverwear-outfit.png", 1080, 1440);
      setStatus("搭配图片已导出");
    } catch {
      setStatus("导出未完成，请重试");
    } finally {
      setBusy(false);
    }
  }
  const composition = (exporting = false) => (
    <div className={`outfit-composition ${exporting ? "for-export" : ""}`}>
      {(Object.keys(slotLabels) as Slot[]).map((slot) => {
        const found = owned.find((o) => o.key === slots[slot]);
        const p = found ? getProduct(found.item.productId) : null;
        return (
          <div
            className="outfit-slot"
            key={slot}
            onDragOver={exporting ? undefined : (e) => e.preventDefault()}
            onDrop={
              exporting
                ? undefined
                : (e) => {
                    e.preventDefault();
                    choose(slot, e.dataTransfer.getData("text/plain"));
                  }
            }
          >
            {p && found ? (
              <>
                <ProductImage
                  product={p}
                  color={Math.max(
                    0,
                    p.colors.findIndex((c) => c.name === found.item.color),
                  )}
                />
                {!exporting && (
                  <button
                    className="icon-btn slot-remove"
                    aria-label={`移除${slotLabels[slot]}`}
                    onClick={() =>
                      setSlots((s) => ({ ...s, [slot]: undefined }))
                    }
                  >
                    <X size={16} />
                  </button>
                )}
                <span className="slot-label">{p.name}</span>
                {!exporting && (
                  <button
                    className="slot-edit"
                    aria-label={`更换${slotLabels[slot]}`}
                    onClick={() => setPicker(slot)}
                  />
                )}
              </>
            ) : exporting ? (
              <span className="muted">{slotLabels[slot]}</span>
            ) : (
              <button className="slot-add" onClick={() => setPicker(slot)}>
                <Plus size={22} />
                <span>选择{slotLabels[slot]}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
  if (!ready) return <StoreLoading />;
  return (
    <main className="container section">
      <div className="section-title">
        <div>
          <p className="eyebrow muted">YOUR PERSONAL EDIT</p>
          <h1>我的衣柜</h1>
        </div>
        <span>{items.length} 件单品</span>
      </div>
      {!items.length ? (
        <div className="empty">
          <h2>Make it yours.</h2>
          <p className="muted">选购喜欢的单品，开始搭配你的衣橱。</p>
          <Link href="/new" className="btn">
            探索新品
          </Link>
        </div>
      ) : (
        <>
          <div className="closet-layout">
            <section className="stack">
              <div className="between">
                <h2>My Pieces</h2>
                <label>
                  <span className="sr-only">衣柜分类</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">全部分类</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="muted">点击加入搭配，或将单品拖入对应位置。</p>
              <div className="owned-grid">
                {owned
                  .filter(
                    (o) =>
                      !category ||
                      getProduct(o.item.productId)?.category === category,
                  )
                  .map(({ item, key }) => {
                    const p = getProduct(item.productId)!;
                    return (
                      <button
                        className="owned-item"
                        key={key}
                        draggable
                        onDragStart={(e) =>
                          e.dataTransfer.setData("text/plain", key)
                        }
                        onClick={() => choose(itemSlot(item), key)}
                      >
                        <ProductImage
                          product={p}
                          color={Math.max(
                            0,
                            p.colors.findIndex((c) => c.name === item.color),
                          )}
                        />
                        <span>{p.name}</span>
                        <small className="muted">
                          {item.color} · {item.size}
                        </small>
                      </button>
                    );
                  })}
              </div>
            </section>
            <section className="stack">
              <h2>Outfit Builder</h2>
              {composition()}
              <label>
                搭配名称
                <input
                  className="full"
                  value={name}
                  maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <div className="row">
                <button
                  className="btn full"
                  disabled={!Object.values(slots).some(Boolean)}
                  onClick={() => {
                    const id = editing ?? crypto.randomUUID();
                    save({
                      id,
                      name: name.trim() || "我的日常搭配",
                      slots,
                      createdAt: Date.now(),
                    });
                    setEditing(id);
                    setStatus("搭配已保存");
                  }}
                >
                  保存搭配
                </button>
                <button
                  className="btn secondary full"
                  disabled={busy || !Object.values(slots).some(Boolean)}
                  onClick={() => void download()}
                >
                  <Download size={16} /> {busy ? "导出中…" : "导出图片"}
                </button>
              </div>
              <p role="status">{status}</p>
              <button
                className="text-button"
                onClick={() => {
                  setSlots({});
                  setEditing(null);
                  setName("我的日常搭配");
                }}
              >
                新建搭配
              </button>
            </section>
          </div>
          <section className="section stack">
            <h2>Saved Outfits</h2>
            {!outfits.length && (
              <p className="muted">保存搭配后，会出现在这里。</p>
            )}
            <div className="saved-outfits">
              {outfits.map((o) => (
                <article className="order-card stack" key={o.id}>
                  <strong>{o.name}</strong>
                  <p className="muted">
                    {Object.values(o.slots).filter(Boolean).length} 件单品
                  </p>
                  <div className="row">
                    <button
                      className="text-button"
                      onClick={() => {
                        setSlots(o.slots);
                        setName(o.name);
                        setEditing(o.id);
                        setStatus("已载入搭配");
                      }}
                    >
                      编辑搭配
                    </button>
                    <button
                      className="text-button"
                      onClick={() => remove(o.id)}
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <div aria-hidden="true" className="export-offscreen">
            <div ref={exportRef} className="export-canvas outfit-export">
              <div>
                <p className="eyebrow">NEVERWEAR · MY WARDROBE</p>
                <h2>{name}</h2>
              </div>
              {composition(true)}
              <p className="export-footer">THE ART OF EVERYDAY · TORONTO</p>
            </div>
          </div>
        </>
      )}
      {picker && (
        <Dialog
          title={`选择${slotLabels[picker]}`}
          close={() => setPicker(null)}
        >
          <div className="owned-grid picker-grid">
            {owned
              .filter((o) => itemSlot(o.item) === picker)
              .map(({ item, key }) => {
                const p = getProduct(item.productId)!;
                return (
                  <button
                    className="owned-item"
                    key={key}
                    onClick={() => choose(picker, key)}
                  >
                    <ProductImage
                      product={p}
                      color={Math.max(
                        0,
                        p.colors.findIndex((c) => c.name === item.color),
                      )}
                    />
                    <span>{p.name}</span>
                    <small>
                      {item.color} · {item.size}
                    </small>
                  </button>
                );
              })}
          </div>
          {!owned.some((o) => itemSlot(o.item) === picker) && (
            <p className="empty muted">衣柜里还没有这类单品。</p>
          )}
        </Dialog>
      )}
    </main>
  );
}
