import Link from "next/link";
import { categories, getProducts } from "@/lib/data";
import { requestTime } from "@/lib/server-time";
import { ProductGrid } from "@/components/product-card";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { HomeSavings } from "@/components/home-savings";
export default async function Home() {
  const products = getProducts();
  const now = await requestTime();
  return (
    <main className="home-main">
      <nav
        className="category-strip container mobile-only"
        aria-label="快捷分类"
      >
        <Link href="/new" className="selected">
          全部
        </Link>
        {categories.map((c) => (
          <Link href={`/c/${c.slug}`} key={c.slug}>
            {c.name.split(" /")[0]}
          </Link>
        ))}
      </nav>
      <section className="container hero-section">
        <Hero />
        <HomeSavings now={now} />
      </section>
      <section className="container section category-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((c) => (
            <Link href={`/c/${c.slug}`} key={c.slug}>
              <div className="product-image">
                <Image
                  src={`/campaign/cat-${c.slug}.webp?v=20261014`}
                  alt={`${c.name} · ${c.en} 精选穿搭`}
                  fill
                  style={{
                    objectPosition:
                      c.slug === "sneakers" || c.slug === "heels"
                        ? "center bottom"
                        : "center",
                  }}
                  sizes="(max-width:1023px) 30vw, 16vw"
                />
              </div>
              <p>{c.name}</p>
              <span className="muted">{c.en}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="section-title">
          <h2>New In</h2>
          <Link href="/new">
            查看全部 {products.filter((p) => p.isNew).length} 件
          </Link>
        </div>
        <ProductGrid
          products={products.filter((p) => p.isNew).slice(0, 8)}
          now={now}
        />
      </section>
      <section className="container section atelier-band">
        <div className="section-title">
          <div>
            <p className="eyebrow">精致细节，优雅步履</p>
            <h2>Atelier</h2>
          </div>
          <Link href="/atelier">探索系列 →</Link>
        </div>
        <ProductGrid
          products={["p25", "p26", "p29", "p31"].map((id) =>
            products.find((p) => p.id === id)!,
          )}
          now={now}
        />
      </section>
      <section className="container section">
        <div className="section-title">
          <h2>Bestsellers</h2>
          <Link href="/new">继续探索 →</Link>
        </div>
        <ProductGrid
          products={products.filter((p) => p.tags.includes("bestseller"))}
          now={now}
        />
      </section>
    </main>
  );
}
