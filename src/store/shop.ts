'use client';
import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '@/lib/storage';
import type { CartItem } from '@/types';
interface Shop { cart: CartItem[]; wishlist: string[]; toggleWish: (id:string)=>void; add: (item:CartItem)=>void }
export const useShop=create<Shop>()(persist((set)=>({cart:[],wishlist:[],toggleWish:id=>set(s=>({wishlist:s.wishlist.includes(id)?s.wishlist.filter(x=>x!==id):[...s.wishlist,id]})),add:item=>set(s=>{const found=s.cart.find(i=>i.productId===item.productId&&i.size===item.size&&i.color===item.color);return {cart:found?s.cart.map(i=>i===found?{...i,qty:i.qty+item.qty}:i):[...s.cart,item]};})}),{name:'neverwear-shop',storage:createJSONStorage(()=>safeStorage),skipHydration:true}));
