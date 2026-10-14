import { requestTime } from "@/lib/server-time";
import { getProducts } from "@/lib/data";
import { Listing } from "@/components/listing";
export default async function NewIn() {
  return (
    <Listing
      title="New In"
      subtitle="冬季新品"
      products={getProducts().filter((p) => p.isNew)}
      now={await requestTime()}
    />
  );
}
