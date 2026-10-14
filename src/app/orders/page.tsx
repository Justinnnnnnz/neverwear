import { Orders } from '@/components/account';
import { requestTime } from '@/lib/server-time';
export default async function OrdersPage(){return <Orders initialNow={await requestTime()}/>;}
