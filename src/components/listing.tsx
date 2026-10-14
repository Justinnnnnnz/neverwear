import type { Product } from '@/types';
import { ProductGrid } from './product-card';
export function Listing({title,subtitle,products,now}:{title:string;subtitle?:string;products:Product[];now:number}) {return <main className="container section"><div className="listing-heading"><p className="eyebrow muted">THE COLLECTION</p><h1>{title}</h1><p className="muted">{subtitle} · {products.length} 件商品</p></div><ProductGrid products={products} now={now}/></main>;}
