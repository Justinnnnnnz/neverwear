import { requestTime } from '@/lib/server-time';
import { notFound } from 'next/navigation';
import { categories,getByCategory } from '@/lib/data';
import { Listing } from '@/components/listing';
export default async function Category({params}:{params:Promise<{category:string}>}) {const {category}=await params;const c=categories.find(c=>c.slug===category);if(!c)notFound();return <Listing title={c.name} subtitle={c.en} products={getByCategory(category)} now={await requestTime()}/>;}
