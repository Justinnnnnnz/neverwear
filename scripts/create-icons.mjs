import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/icons',{recursive:true});
for(const [name,size] of [['icon-192',192],['icon-512',512],['maskable-512',512],['apple-touch-icon',180]]){const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><rect width="512" height="512" fill="#141414"/><path d="M148 342V170H170L257 302V170H282V342H260L173 210V342Z" fill="#FFFFFF"/><path d="M303 170H331L355 300L384 170H412L369 342H341Z" fill="#FFFFFF"/></svg>`;await sharp(Buffer.from(svg)).png().toFile(`public/icons/${name}.png`);}
