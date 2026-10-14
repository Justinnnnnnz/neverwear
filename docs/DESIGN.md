# NeverWear — Design Guide

## Principles

1. **Realism first.** The dopamine comes from believing you're really shopping. ~90% of the UI must be indistinguishable from a good fast-fashion store. If something reads as a joke at first glance, it's wrong.
2. **Editorial minimalism.** White ground, near-black type, lots of space, product imagery dominates, text recedes. Square corners, hairline dividers, no shadows, no gradients, no rounded cards.
3. **One accent, used only as a buying signal.** Magenta appears on: low-stock hints, discount %, cart badge, gift progress bar, Sale link. Never decorative.
4. **Easter eggs are quiet and escalate late.** Browsing: almost none. Checkout: one small honest note. After ordering: the reveal (savings, "*大概率不会"). This keeps the illusion and makes the post-order screen worth screenshotting.
5. **Keep the real e-commerce psychology:** scarcity, viewers count, strike-through prices, sold-out sizes, gift threshold, "cart doesn't hold stock".

## Tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#141414` | text, primary buttons |
| `--ink-2` | `#3A3A3A` | body secondary |
| `--muted` | `#5C5C5C` | captions (passes 4.5:1 on white) |
| `--faint` | `#8A8780` | the small 模拟/彩蛋 notes only (11–12px) |
| `--line` | `#E3E1DC` | dividers |
| `--line-2` | `#CFCBC4` | input/size-pill borders |
| `--surface` | `#F2F0EB` | info boxes, image placeholder base |
| `--surface-2` | `#F7F6F3` | review cards, disabled pills |
| `--bg` | `#FFFFFF` | page |
| `--accent` | `#C2185B` | buying signals (see principle 3) |

Typography:
- Display: **Bodoni Moda** 400/600 — logo `NEVERWEAR` (letter-spacing .12em), hero (72–76px desktop / 34px mobile), section titles (36px / 24px), Thank-you title.
- Body: **Noto Sans SC** 400/500/700 — 14–15px body, 12–13px meta, 11px eyebrow (letter-spacing .14–.2em).
- Prices: Noto Sans SC 500.

Spacing: 4px base; sections 56–64px apart on desktop, 20–24px on mobile. Radius: **0** everywhere except swatches (circle) and badges' count bubble.

## Components

- **Announcement bar**: accent background, white 12–13px text, centred: `满 $150 免运费 · 30 天免费退换`.
- **Primary button**: ink background, white text, 52–56px tall, square. **Secondary**: 1px ink border. Pressed state: opacity .85.
- **Size pill**: 44–48px tall, `--line-2` border; selected = ink fill + white; sold out = dashed border, `--surface-2` fill, line-through, `not-allowed`.
- **Unit toggle (US / EU / CN)**: segmented, 1px ink border, selected segment ink fill.
- **Colour swatch**: 32px circle inside a 44px button; selected = 1.5px ink ring.
- **Badge on product image**: white chip, 11–12px 500; text ink, or accent for scarcity/discount.
- **Product card**: 2:3 image, name + price row, English name in muted 12px, colour dots 14px.
- **Product photos**: AI-generated per `docs/IMAGES.md` (warm light-grey studio background #EEECE8, 2:3 source shown in 2:3 frames; on-model photos use `object-fit: contain` to preserve the entire head-to-toe composition, close-ups use `cover`).
- **Image placeholders** (fallback only where a generated image is missing): a 2:3 block in the product's first colour hex (each image of the gallery a slightly lighter/darker tone of it), with a simple centred line-art silhouette SVG per subcategory (coat, puffer, tee, shirt, knit, skirt, dress, pant, jeans, shorts, sneaker, boot, pump, sandal) in a contrasting tone at 40% opacity. If `product.images` exist, use `next/image` instead.
- **Mobile tab bar**: 5 items, icon + 11px label, active = ink, inactive = muted.

## Copy rules

Tone: a real, slightly upscale store. Short, factual, confident.

Use real e-commerce copy everywhere: 选购新品, 加入购物车, 去结算, 预计 10月17日 – 10月20日 送达, 30 天免费退换, 仅剩 1 双, 23 人正在看, 已加入购物车.

The ONLY places simulated/parody wording may appear, always in `--faint`, 10–12px:

| Where | Text |
|---|---|
| Footer | `本站为模拟购物体验，不产生真实扣款或发货。` |
| PDP, under add-to-cart | `模拟购物 · 不会实际扣款` |
| Checkout / cart, under pay button | `模拟支付，不会实际扣款` |
| Home, small right-aligned link | `本月已省 $1,284 · 查看月度报告` |
| Order page, under Thank-you | `本单省下 $X · 本月累计 $Y` |
| Tracking, after delivery estimate | `*大概率不会` |
| Report page | may be playful (it's the shareable reveal) |

Never write: 假装, 反正不发货, 理智卡, 不存在的, or similar jokes in body copy, buttons or headings.

## Reference mockups

`docs/mockups/` has the 6 approved screens (desktop home, desktop PDP, mobile home, mobile PDP, mobile cart, mobile tracking). Match their layout, hierarchy and copy.
