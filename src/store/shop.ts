'use client';
import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '@/lib/storage';
import type { CartItem } from '@/types';
interface Shop { cart: CartItem[]; wishlist: string[]; toggleWish: (id:string)=>void; add: (item:CartItem)=>void; updateItem: (index:number,patch:Partial<CartItem>)=>void; removeItem: (index:number)=>void }
export const useShop=create<Shop>()(persist((set)=>({cart:[],wishlist:[],updateItem:(index,patch)=>set(s=>({cart:s.cart.map((i,n)=>n===index?{...i,...patch}:i)})),removeItem:index=>set(s=>({cart:s.cart.filter((_,n)=>n!==index)})),toggleWish:id=>set(s=>({wishlist:s.wishlist.includes(id)?s.wishlist.filter(x=>x!==id):[...s.wishlist,id]})),add:item=>set(s=>{const found=s.cart.find(i=>i.productId===item.productId&&i.size===item.size&&i.color===item.color);return {cart:found?s.cart.map(i=>i===found?{...i,qty:i.qty+item.qty}:i):[...s.cart,item]};})}),{name:'neverwear-shop',storage:createJSONStorage(()=>safeStorage),skipHydration:true}));
