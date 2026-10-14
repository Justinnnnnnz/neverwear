"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { useStoreReady } from "@/store/ready";
import { StoreLoading } from "./store-loading";
import { useShop } from "@/store/shop";
import { monthKey } from "@/lib/sim";
import { monthlyReport } from "@/lib/report";
import { formatPrice } from "@/lib/pricing";
import { exportImage } from "@/lib/export-image";
export function Report({ now }: { now: number }) {
  const ready = useStoreReady();
  const orders = useShop((s) => s.orders);
  const current = monthKey(now);
  const [month, setMonth] = useState(current);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const r = monthlyReport(orders, month);
  const content = (
    <>
      <header className="stack">
        <p className="eyebrow">NEVERWEAR · THE MONTHLY EDIT</p>
        <h2>
          {month.replace("-", " / ")}
          <br />
          购物月度报告
        </h2>
        <p className="muted">衣橱满了，钱包还在。</p>
      </header>
      <section className="report-saved">
        <span>这个月，你省下了</span>
        <p>{formatPrice(r.saved)}</p>
        <small>每一次心动，都没有真的花掉。</small>
      </section>
      <div className="report-stats">
        <div>
          <span>下单次数</span>
          <strong>{r.orders}</strong>
        </div>
        <div>
          <span>入手单品</span>
          <strong>{r.items}</strong>
        </div>
        <div>
          <span>最爱品类</span>
          <strong>{r.category}</strong>
        </div>
        <div>
          <span>最爱颜色</span>
          <strong>{r.color}</strong>
        </div>
        <div>
          <span>最晚心动时间</span>
          <strong>{r.latest}</strong>
          <small>以 06:00 为一天起点</small>
        </div>
      </div>
      <footer className="report-sign">
        <p className="display">
          All the joy.
          <br />
          None of the spending.
        </p>
        <p>NEVERWEAR · TORONTO</p>
      </footer>
    </>
  );
  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      await exportImage(
        ref.current,
        `neverwear-report-${month}.png`,
        1080,
        1920,
      );
      setStatus("月度报告已导出，适合分享至小红书");
    } catch {
      setStatus("导出未完成，请重试");
    } finally {
      setBusy(false);
    }
  }
  if (!ready) return <StoreLoading />;
  return (
    <main className="container section narrow">
      <div className="section-title">
        <h1>月度报告</h1>
        <label>
          <span className="sr-only">选择月份</span>
          <input
            type="month"
            value={month}
            max={current}
            onChange={(e) => {
              if (e.target.value) setMonth(e.target.value);
            }}
          />
        </label>
      </div>
      <div className="report-preview stack">{content}</div>
      <div className="row section">
        <button
          className="btn full"
          disabled={busy}
          onClick={() => void download()}
        >
          <Download size={18} /> {busy ? "导出中…" : "导出分享图片"}
        </button>
        <Link href="/new" className="btn secondary full">
          继续探索
        </Link>
      </div>
      <p role="status">{status}</p>
      {!r.orders && (
        <p className="muted" style={{ marginTop: 16 }}>
          这个月还没有订单，你的下一次心动正在路上。
        </p>
      )}
      <div className="export-offscreen" aria-hidden="true">
        <div ref={ref} className="export-canvas report-export stack">
          {content}
        </div>
      </div>
    </main>
  );
}
