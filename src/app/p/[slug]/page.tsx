import { notFound } from "next/navigation";
import { getProduct, getProducts, getReviews } from "@/lib/data";
import { requestTime } from "@/lib/server-time";
import { PDP } from "@/components/pdp";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: `${getProduct(slug)?.name ?? "商品"} · NEVERWEAR` };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  return (
    <PDP
      product={p}
      reviews={getReviews(p.id)}
      related={getProducts()
        .filter((x) => x.id !== p.id && x.category === p.category)
        .slice(0, 4)}
      now={await requestTime()}
    />
  );
}
