import { requestTime } from '@/lib/server-time';
import { getProducts } from '@/lib/data';
import { Listing } from '@/components/listing';
export default async function Sale(){return <Listing title="Sale" subtitle="精选折扣" products={getProducts().filter(p=>p.compareAtPrice)} now={await requestTime()}/>;}
