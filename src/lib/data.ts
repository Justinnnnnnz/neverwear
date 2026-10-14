import catalogue from '../../data/products.json';
import reviewData from '../../data/reviews.json';
import type { Product, Review, CategorySlug } from '@/types';
export const categories: { slug: CategorySlug; name: string; en: string }[] = [
 {slug:'outerwear',name:'外套',en:'Outerwear'}, {slug:'tops',name:'上衣 / T-shirt',en:'Tops'}, {slug:'skirts-dresses',name:'裙装',en:'Dresses & Skirts'}, {slug:'pants',name:'裤装',en:'Pants & Shorts'}, {slug:'sneakers',name:'运动鞋',en:'Sneakers'}, {slug:'heels',name:'高跟鞋 / 靴',en:'Heels & Boots'}
];
export const getProducts = (): Product[] => catalogue as Product[];
export const getProduct = (idOrSlug: string) => getProducts().find(p=>p.id===idOrSlug || p.slug===idOrSlug);
export const getByCategory = (category: string) => getProducts().filter(p=>p.category===category);
export const getReviews = (id: string) => (reviewData as Review[]).filter(r=>r.productId===id);
