import { connection } from 'next/server';
export async function requestTime() { await connection(); return Date.now(); }
