'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/pricing';
import { viewers } from '@/lib/sim';
import { useShop } from '@/store/shop';
import { ProductImage } from './product-image';
export function ProductCard({product:p,now}:{product:Product;now:number}) {const wished=useShop(s=>s.wishlist.includes(p.id));const toggle=useShop(s=>s.toggleWish);const discount=p.compareAtPrice?Math.round((1-p.price/p.compareAtPrice)*100):0;return <article className="product-card"><div className="card-photo"><Link href={`/p/${p.slug}`} aria-label={`查看${p.name}`}><ProductImage product={p}/>{p.images?.c0?.[1]&&<ProductImage product={p} index={1} className="hover-photo"/>}</Link><span className={`badge ${discount||p.lowStockSizes.length?'accent':''}`}>{discount?`-${discount}%`:p.lowStockSizes.length?`仅剩 1 ${p.sizeType==='shoe'?'双':'件'}`:p.isNew?'New':`${viewers(p.id,now)} 人正在看`}</span><button className="icon-btn heart" aria-label={wished?`从心愿单移除${p.name}`:`收藏${p.name}`} aria-pressed={wished} onClick={()=>toggle(p.id)}><Heart size={22} fill={wished?'currentColor':'none'}/></button></div><Link href={`/p/${p.slug}`} className="card-info"><div className="card-title"><h3>{p.name}</h3><span>{formatPrice(p.price)}</span></div><p className="muted card-en">{p.nameEn}</p>{p.compareAtPrice&&<del className="muted card-en">{formatPrice(p.compareAtPrice)}</del>}<div className="color-dots">{p.colors.map(c=><span title={c.name} key={c.name} style={{background:c.hex}}/>)}</div></Link></article>;}
export function ProductGrid({products,now}:{products:Product[];now:number}) {return <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p} now={now}/>)}</div>;}
