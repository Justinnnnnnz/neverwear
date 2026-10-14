"use client";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { safeStorage } from "@/lib/storage";
import { Dialog } from "./dialog";
const emptySubscribe = () => () => {};
export function SearchForm({
  initial = "",
  close,
}: {
  initial?: string;
  close?: () => void;
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [q, setQ] = useState(initial);
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const raw = safeStorage.getItem("neverwear-searches");
      return typeof raw === "string" ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const router = useRouter();
  function search(value: string) {
    if (!value.trim()) return;
    const values = [
      value.trim(),
      ...recent.filter((r) => r !== value.trim()),
    ].slice(0, 6);
    safeStorage.setItem("neverwear-searches", JSON.stringify(values));
    setRecent(values);
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    close?.();
  }
  return (
    <div className="stack">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          search(q);
        }}
      >
        <label
          className="sr-only"
          htmlFor={close ? "overlay-search" : "page-search"}
        >
          搜索商品
        </label>
        <input
          autoFocus={!!close}
          id={close ? "overlay-search" : "page-search"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索商品、品类…"
        />
        <button className="btn" aria-label="搜索商品">
          <Search size={20} />
        </button>
      </form>
      <div className="between">
        <span className="muted">最近搜索</span>
        {mounted && recent.length > 0 && (
          <button
            className="text-button"
            onClick={() => {
              safeStorage.removeItem("neverwear-searches");
              setRecent([]);
            }}
          >
            清除记录
          </button>
        )}
      </div>
      <div className="row search-recent">
        {mounted &&
          recent.map((r) => (
            <button className="size-pill" key={r} onClick={() => search(r)}>
              {r}
            </button>
          ))}
      </div>
      {(!mounted || !recent.length) && (
        <p className="muted">试试「大衣」「靴」或「Knit」</p>
      )}
    </div>
  );
}
export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="icon-btn"
        aria-label="打开搜索"
        onClick={() => setOpen(true)}
      >
        <Search size={22} />
      </button>
      {open && (
        <Dialog title="搜索" close={() => setOpen(false)}>
          <SearchForm close={() => setOpen(false)} />
          <button className="sr-only" onClick={() => setOpen(false)}>
            <X />
            关闭
          </button>
        </Dialog>
      )}
    </>
  );
}
