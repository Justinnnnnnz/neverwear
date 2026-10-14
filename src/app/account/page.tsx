import { Account } from "@/components/account";
import { requestTime } from "@/lib/server-time";
export default async function AccountPage() {
  return <Account now={await requestTime()} />;
}
