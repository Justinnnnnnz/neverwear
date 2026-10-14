# NeverWear — Product Spec

## 1. Summary

A simulated fashion e-commerce site. Users get the full buying experience (browse → pick size/colour → cart → checkout → order tracking → "own" it in a virtual closet) with no charge and no delivery. It must feel like a real store; the parody shows only in quiet, small grey notes and in the savings stats.

Platforms: one responsive Next.js web app that works on desktop and phone, installable as a PWA.

## 2. Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/atelier` | Atelier collection (p25–p34) |
| `/new` | New In (all products with `isNew`) |
| `/sale` | Sale (products with `compareAtPrice`) |
| `/c/[category]` | Category listing (`outerwear`, `tops`, `skirts-dresses`, `pants`, `sneakers`, `heels`) |
| `/p/[slug]` | Product detail (PDP) |
| `/search?q=` | Search results |
| `/wishlist` | Wishlist |
| `/cart` | Cart (full page; on desktop the header cart icon opens a drawer instead) |
| `/checkout` | Checkout |
| `/order/[id]` | Order confirmation + tracking |
| `/orders` | Order history |
| `/closet` | 我的衣柜 + outfit builder |
| `/report` | Monthly shopping report (月度报告) |
| `/account` | 我的: savings summary, preferences, reset data |
| `/size-guide` | Size guide + shoe size conversion |
| `not-found` | Styled 404 |

## 3. Data model (`src/types`)

```ts
type CategorySlug = 'outerwear' | 'tops' | 'skirts-dresses' | 'pants' | 'sneakers' | 'heels';

interface Color { name: string; hex: string }

interface Product {
  id: string; slug: string;
  collection?: 'atelier';
  name: string; nameEn: string;
  category: CategorySlug; subcategory: string;   // e.g. 'boots', 'pumps', 'jeans'
  price: number; compareAtPrice: number | null;   // cents
  colors: Color[];
  sizeType: 'apparel' | 'shoe';
  sizes: string[];             // apparel: XXS–XL; shoe: US sizes
  soldOutSizes: string[];      // shown crossed out, not selectable
  lowStockSizes: string[];     // "仅剩 1 件/双"
  heelHeightCm?: number;       // shoes only
  fit: string;                 // e.g. '偏小半码，建议选大半码'
  description: string;
  details: string[];           // material, measurements, care
  tags: ('new' | 'bestseller')[];
  isNew: boolean;
  rating: number; reviewCount: number;
  images?: Record<string, string[]>; // per colour key ('c0','c1',…) → image paths, filled in commit 17 (see docs/IMAGES.md); fall back to placeholders
}

interface CartItem { productId: string; color: string; size: string; qty: number; addedAt: number }

interface Order {
  id: string;                  // 'NW-MMDD-XXXX'
  items: CartItem[];
  subtotal: number; shipping: number; tax: number; total: number; // cents
  shippingMethod: 'standard' | 'express';
  address: { name?: string; city: string; province: string; postal?: string };
  createdAt: number;
}

interface ClosetItem { productId: string; color: string; size: string; orderId: string; addedAt: number }
interface Outfit { id: string; name: string; slots: { top?: string; bottom?: string; outer?: string; shoes?: string }; createdAt: number } // slot = ClosetItem key
```

Seed data: `data/products.json` (34 products: 24 core + 10 Atelier, prices in cents). Also generate `data/reviews.json`: 2–3 realistic reviews per product (nickname, size bought, height, fit "偏小/合适/偏大", rating, text). Reviews read like real buyers (fit, fabric, how it looks on); at most 1 in 10 may be lightly funny, never parody-of-the-site.

Shoe size table (women's, reference only — label it 参考换算):

| US | 5 | 5.5 | 6 | 6.5 | 7 | 7.5 | 8 | 8.5 | 9 | 9.5 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EU | 35.5 | 36 | 36.5 | 37 | 37.5 | 38 | 38.5 | 39 | 40 | 40.5 | 41 |
| 脚长 mm | 220 | 225 | 230 | 235 | 240 | 245 | 250 | 255 | 260 | 265 | 270 |

Atelier: p25–p34, ten heels and boots priced $1,095–$1,895. Keep the 24 core products unchanged. `/atelier` uses the shared listing and filters. Home includes an Atelier band featuring p25, p26, p29 and p31. The collection includes mules and riding boots; the 3 cm riding boot belongs to the 低跟 bucket.

## 4. Simulated logic (`src/lib/sim.ts`)

- **Pricing**: free standard shipping over $150 (else $12); express $25. Tax = Ontario HST 13% on subtotal + shipping. All in cents.
- **Gift progress bar** in cart: "再买 $X 即可获赠限量帆布托特包" toward $300; when reached: "已获赠限量帆布托特包".
- **Viewers / stock hints**: deterministic per product per hour — `viewers = 8 + hash(id + hour) % 30`. Low-stock sizes show "仅剩 1 件/双".
- **Payment**: NeverPay •••• 0000 always succeeds after a 1.2 s "处理中…" state. No card form.
- **Order tracking** — status derived from minutes since `createdAt`:
  - 0 → 已下单 (付款成功 · NeverPay •••• 0000)
  - ≥ 3 min → 已出库 (Mississauga 仓库已出库)
  - ≥ 20 min → 运输中 (包裹已到达 Toronto 分拣中心)
  - ≥ 2 h → 等待派送 — and it stays here forever.
  - "已送达" row always shows `预计 {createdAt + 3 days, formatted 10月17日} 送达` followed by the muted note `*大概率不会`.
- **Closet**: placing an order adds every item to the closet.
- **Savings**: each order total counts as "saved". Show per order, per month, all-time.
- **Reset**: `/account` has "清除所有数据" (confirm dialog) that clears all stores.

## 5. Commit plan (implement and commit in this order)

Each item = one commit (Conventional Commits). Acceptance criteria in brackets.

0. `chore: scaffold Next.js, Tailwind, fonts, design tokens` — [tokens from DESIGN.md as CSS variables + Tailwind theme; fonts loaded; `.gitignore`; GitHub repo created and pushed]
1. `feat(data): product types, catalogue, size conversion, price helpers` — [typed loaders `getProducts/getProduct/getByCategory`, `formatPrice`, `convertShoeSize`, reviews.json generated]
2. `feat(layout): announcement bar, header, mega menu, mobile tab bar, footer` — [desktop: top nav with hover mega menu listing subcategories; mobile: hamburger + bottom tab bar (首页/分类/我的衣柜/购物车/我的) with cart badge; footer with the small 模拟购物 note]
3. `feat(plp): product card and category listing` — [placeholder images per DESIGN.md; badge (New / -30% / 仅剩 1 件 / N 人正在看); heart toggles wishlist; colour dots; second image on hover (desktop); 2 columns mobile, 3–4 desktop]
4. `feat(plp): filters and sort` — [filters: size, colour, price range, heel height bucket (平底 <2 / 低跟 2–5 / 中跟 5–8 / 高跟 >8 cm, shoes only), subcategory; sort: 推荐 / 最新 / 价格↑ / 价格↓; state in URL query; desktop left sidebar, mobile bottom sheet; result count; clear all]
5. `feat(home): home page` — [hero "The Winter Edit", category tiles, New In row, Bestsellers row, small muted "本月已省 $X · 查看月度报告" link]
6. `feat(pdp): product detail page` — [gallery (desktop 2×2 grid, mobile swipe carousel with dots); colour swatches change images; size selector with US/EU/CN toggle for shoes; sold-out sizes crossed out & disabled; low-stock + viewers hint; fit note box; details accordion; delivery info "预计 X 月 X 日 – X 日送达"; reviews with fit slider; add to cart requires size (shake + message if missing); sticky add-to-cart bar on mobile; "你可能也喜欢" row; tiny "模拟购物 · 不会实际扣款" under the button]
7. `feat(search): search` — [header search overlay; matches name/nameEn/subcategory; recent searches; results page reuses grid]
8. `feat(wishlist): wishlist` — [persisted; move to cart]
9. `feat(cart): cart drawer and cart page` — [qty stepper, remove, edit size; gift progress bar; subtotal/shipping/HST/total; "购物车商品不保留库存，热门尺码可能随时售罄" note; empty state; desktop drawer slides from right]
10. `feat(checkout): checkout` — [steps on one page: 收货信息 (all optional, default city Toronto ON, stored locally only), 配送方式 (standard/express), 付款方式 (NeverPay •••• 0000 preselected, no card fields), order summary; "去结算/支付 $X" button with processing state; tiny "模拟支付，不会实际扣款"]
11. `feat(order): confirmation and tracking` — [Thank you page, order number, time-based timeline from §4, items, "已加入「我的衣柜」" with link, muted "本单省下 $X · 本月累计 $Y"; buttons 分享 (Web Share API, fallback copy link) / 继续购物]
12. `feat(account): order history and account` — [`/orders` list with status; `/account` savings summary, links, reset data]
13. `feat(closet): closet and outfit builder` — [grid of owned items, filter by category; outfit builder with slots 外套/上衣/下装/鞋 — tap to choose on mobile, drag on desktop; save outfits; export outfit as a 1080×1440 PNG via html-to-image]
14. `feat(report): monthly report` — [month picker; total saved, orders count, items, favourite category, latest-night order time, top colour; share image export 1080×1920 for 小红书]
15. `feat(size-guide): size guide` — [apparel table (XXS–XL bust/waist/hip cm) and the shoe table from §3]
16. `feat(pwa): manifest, icons, offline shell` — [web manifest, generated icons, theme colour, basic service worker caching the app shell; installable]
17. `feat(images): AI-generated product and campaign photography` — [follow `docs/IMAGES.md`: generate **Phase 1 only — 76 images** (on-model front + close-up for the first colour of all 34 products, 2 hero, 6 category tiles), converted to WebP, saved under `public/`, wired into `products.json` and into hero/category tiles; card hover and PDP gallery use them; other colours show the tinted placeholder; do NOT generate Phase 2. May be split into several `feat(images): …` commits (e.g. one per category) to keep commits small]
18. `chore: polish, a11y, 404, README` — [keyboard nav, focus states, loading/empty states, 404, Lighthouse a11y ≥ 95 on home & PDP, README with run instructions]

## 6. Responsive rules

- Mobile-first. Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Content max-width 1360px, side padding 16px mobile / 40px desktop.
- Below `lg`: hide desktop nav, show bottom tab bar (fixed, 64px + safe-area inset), header becomes menu / logo / search.
- PDP below `lg`: images on top, fixed bottom bar with price + 加入购物车.
- No horizontal page scroll at 360px width.

## 7. Out of scope

Real payments, accounts/login, backend, real shipping, admin panel, inventory sync, i18n beyond zh-CN.

## 8. Final step

After the last commit: run `npm run build`, start the dev server in the background (`npm run dev`, port 3000; if busy, use the next free port), confirm it responds, and report the exact local URL and the GitHub repo URL. Also tell the user the one command to start it again later.
