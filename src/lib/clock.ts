'use client';
import { useEffect,useState } from 'react';
export function useClock(initial:number){const [now,setNow]=useState(initial);useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),15000);return()=>clearInterval(timer);},[]);return now;}
