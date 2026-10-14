export type CategorySlug =
  "outerwear" | "tops" | "skirts-dresses" | "pants" | "sneakers" | "heels";
export interface Color {
  name: string;
  hex: string;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  compareAtPrice: number | null;
  colors: Color[];
  sizeType: "apparel" | "shoe";
  sizes: string[];
  soldOutSizes: string[];
  lowStockSizes: string[];
  heelHeightCm?: number;
  fit: string;
  description: string;
  details: string[];
  tags: ("new" | "bestseller")[];
  isNew: boolean;
  rating: number;
  reviewCount: number;
  images?: Record<string, string[]>;
}
export interface Review {
  productId: string;
  nickname: string;
  size: string;
  height: number;
  fit: "偏小" | "合适" | "偏大";
  rating: number;
  text: string;
}
export interface CartItem {
  productId: string;
  color: string;
  size: string;
  qty: number;
  addedAt: number;
}
export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: "standard" | "express";
  address: { name?: string; city: string; province: string; postal?: string };
  createdAt: number;
}
export interface ClosetItem {
  productId: string;
  color: string;
  size: string;
  orderId: string;
  addedAt: number;
}
export interface Outfit {
  id: string;
  name: string;
  slots: { top?: string; bottom?: string; outer?: string; shoes?: string };
  createdAt: number;
}
