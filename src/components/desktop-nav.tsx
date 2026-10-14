"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, getByCategory } from "@/lib/data";
import { subcategoryLabel } from "@/lib/subcategories";

export function DesktopNav() {
  const pathname = usePathname();
  const search = useSearchParams();
  // A pathname OR query change discards open state and any pending timer.
  return <MegaNavigation key={`${pathname}?${search.toString()}`} />;
}
function MegaNavigation() {
  const [open, setOpen] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFirst = useRef(false);
  function cancelClose() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }
  function close() {
    cancelClose();
    setOpen(null);
  }
  function enter(slug: string) {
    cancelClose();
    setOpen(slug);
  }
  function leave() {
    cancelClose();
    timer.current = setTimeout(() => setOpen(null), 150);
  }
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) {
      nav.current?.querySelector<HTMLAnchorElement>(`#mega-${open} a`)?.focus();
      focusFirst.current = false;
    }
    const outside = (event: PointerEvent) => {
      const group = nav.current?.querySelector(`[data-category="${open}"]`);
      if (!group?.contains(event.target as Node)) {
        if (timer.current) clearTimeout(timer.current);
        setOpen(null);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (timer.current) clearTimeout(timer.current);
      setOpen(null);
      nav.current
        ?.querySelector<HTMLAnchorElement>(`[data-category="${open}"] > a`)
        ?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <nav ref={nav} className="desktop-nav" aria-label="主导航">
      <Link href="/new" onClick={close}>
        New In
      </Link>
      <Link href="/atelier" onClick={close}>
        Atelier
      </Link>
      {categories.map((c) => (
        <div
          key={c.slug}
          className="nav-group"
          data-category={c.slug}
          onMouseEnter={() => enter(c.slug)}
          onMouseLeave={leave}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              close();
          }}
        >
          <Link
            href={`/c/${c.slug}`}
            aria-expanded={open === c.slug}
            aria-controls={`mega-${c.slug}`}
            onClick={(event) => {
              close();
              event.currentTarget.blur();
            }}
            onKeyDown={(event) => {
              if (["Enter", " ", "ArrowDown"].includes(event.key)) {
                event.preventDefault();
                cancelClose();
                if (event.key === "ArrowDown" && open === c.slug)
                  nav.current
                    ?.querySelector<HTMLAnchorElement>(`#mega-${c.slug} a`)
                    ?.focus();
                else {
                  focusFirst.current = event.key === "ArrowDown";
                  setOpen(c.slug);
                }
              }
            }}
          >
            {c.name.split(" /")[0]}
          </Link>
          {open === c.slug && (
            <div
              id={`mega-${c.slug}`}
              className="mega"
              onMouseEnter={cancelClose}
              onMouseLeave={leave}
            >
              <nav className="subcategory-columns" aria-label={`${c.name}品类`}>
                <Link
                  href={`/c/${c.slug}`}
                  onClick={(event) => {
                    close();
                    event.currentTarget.blur();
                  }}
                >
                  查看全部 {c.name}
                </Link>
                {[
                  ...new Set(getByCategory(c.slug).map((p) => p.subcategory)),
                ].map((sub) => (
                  <Link
                    key={sub}
                    href={`/c/${c.slug}?subcategory=${sub}`}
                    onClick={(event) => {
                      close();
                      event.currentTarget.blur();
                    }}
                  >
                    {subcategoryLabel(sub)}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      ))}
      <Link href="/sale" className="accent" onClick={close}>
        Sale
      </Link>
    </nav>
  );
}
