import type { StateStorage } from 'zustand/middleware';
export const safeStorage: StateStorage = {
 getItem: name => { try { return typeof window==='undefined'?null:window.localStorage.getItem(name); } catch { return null; } },
 setItem: (name,value) => { try { window.localStorage.setItem(name,value); } catch {} },
 removeItem: name => { try { window.localStorage.removeItem(name); } catch {} },
};
