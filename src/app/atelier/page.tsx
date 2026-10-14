import { Listing } from "@/components/listing";
import { getAtelierProducts } from "@/lib/data";
import { requestTime } from "@/lib/server-time";
export const metadata = {
  title: "Atelier · NeverWear",
  description: "精致细节，优雅步履。探索 Atelier 高跟鞋与靴履。",
};
export default async function Atelier() {
  return (
    <Listing
      title="Atelier"
      subtitle="精致细节，优雅步履"
      products={getAtelierProducts()}
      now={await requestTime()}
    />
  );
}
