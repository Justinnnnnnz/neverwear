import type { CartItem } from '@/types';
import { getProduct } from './data';
export const formatPrice = (cents: number) => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',currencyDisplay:'narrowSymbol'}).format(cents/100);
export function totals(items: CartItem[], method: 'standard'|'express' = 'standard') { const subtotal=items.reduce((sum,i)=>sum+(getProduct(i.productId)?.price??0)*i.qty,0); const shipping=subtotal===0?0:method==='express'?2500:subtotal>=15000?0:1200; const tax=Math.round((subtotal+shipping)*.13); return {subtotal,shipping,tax,total:subtotal+shipping+tax}; }
