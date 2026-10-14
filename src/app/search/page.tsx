import { getProducts } from "@/lib/data";
import { requestTime } from "@/lib/server-time";
import { Listing } from "@/components/listing";
import { SearchForm } from "@/components/search";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const products = getProducts().filter(
    (p) =>
      !query ||
      [p.name, p.nameEn, p.subcategory].join(" ").toLowerCase().includes(query),
  );
  return (
    <>
      <div className="container section">
        <SearchForm initial={q} />
      </div>
      <Listing
        title={q ? `“${q}” 的搜索结果` : "搜索商品"}
        products={products}
        now={await requestTime()}
      />
    </>
  );
}
