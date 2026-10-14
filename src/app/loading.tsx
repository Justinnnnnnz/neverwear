export default function Loading() {
  return (
    <main className="container section" aria-busy="true" aria-label="正在加载">
      <p className="muted" role="status">
        正在为你准备精选单品…
      </p>
      <div className="product-grid" style={{ marginTop: 24 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="product-image"
            style={{ background: "var(--surface)" }}
          />
        ))}
      </div>
    </main>
  );
}
