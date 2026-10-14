import { OrderDetail } from "@/components/order";
import { requestTime } from "@/lib/server-time";
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetail id={id} initialNow={await requestTime()} />;
}
