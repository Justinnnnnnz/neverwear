import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container section empty">
      <p className="eyebrow muted">404 · PAGE NOT FOUND</p>
      <h1 className="display">Page not found.</h1>
      <p className="muted">
        这个页面暂时找不到了。继续探索你的下一件心动单品。
      </p>
      <Link className="btn" href="/">
        返回首页
      </Link>
    </main>
  );
}
