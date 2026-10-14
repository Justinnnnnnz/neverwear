"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container section empty">
      <h1>页面暂时未能加载</h1>
      <p className="muted">请稍后重试。</p>
      <button className="btn" onClick={reset}>
        重新加载
      </button>
    </main>
  );
}
