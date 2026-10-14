# NeverWear — Image Generation Brief

All product and campaign images are **original AI-generated images**. Generate them yourself, save them into the repo, and wire them into `data/products.json`.

## How to generate

Try these in order and use the first that works:

1. **Codex built-in image generation** (the `$imagegen` skill / native `image_gen` tool, model gpt-image-2). No API key needed; it uses the ChatGPT plan's limits. Generated files land in `$CODEX_HOME/generated_images/` (default `~/.codex/generated_images/`) — move each one into the project path below right after it is generated.
2. If the built-in tool is unavailable but `OPENAI_API_KEY` is set: write `scripts/generate-images.mjs` that calls the OpenAI Images API (gpt-image-2, `size: "1024x1536"`), reads the shot list below, skips files that already exist, and paces requests (≤ 5 per minute unless the API allows more).
3. If neither works: keep the silhouette placeholders, finish everything else, and tell me at the end exactly what's missing and how to run the script later.

Generation must be **resumable**: before generating a file, check whether it already exists; keep `data/image-manifest.json` (`{ "<path>": { "prompt": "...", "status": "done" } }`) up to date so a rerun only fills gaps.

## Shot list

For now every product gets **one model try-on shot and one product close-up** (first colour); more shots come in a later phase. `<color-key>` = colour index (`c0`, `c1`, …) in `products.json`.

**Phase 1 — generate now (56 images total, nothing more):** one category at a time, both shots for a product before moving on.

| File | Shot | Count |
|---|---|---|
| `public/products/<slug>/c0-1.webp` | **On-model, full look, front** — the main image, first colour of the product | 24 |
| `public/products/<slug>/c0-2.webp` | **Product close-up**, first colour — fabric texture, stitching, buttons, zip; for shoes the heel, toe shape and material | 24 |
| `public/campaign/hero-1.webp`, `hero-2.webp` | Campaign / lookbook, landscape 1536×1024, home hero | 2 |
| `public/campaign/cat-<category>.webp` | On-model image representing the category, 6 category tiles | 6 |

**Phase 2 — do NOT generate now.** Only when I explicitly ask later. Build the code so these drop in automatically when the files appear in `products.json`:

| File | Shot |
|---|---|
| `public/products/<slug>/<color-key>-p.webp` | Clean product shot on studio background, every colour |
| `public/products/<slug>/c0-3.webp` | On-model second pose — 3/4 turn, side or back, walking |
| `public/products/<slug>/<color-key>-1.webp` for c1, c2… | On-model front in the other colours |

Gallery behaviour:
- First colour (`c0`): on-model front (`-1`) → close-up (`-2`); later also second pose (`-3`) and product shot (`-p`) once they exist.
- Other colours (no photos yet in Phase 1): show the placeholder silhouette tinted in that colour's hex (DESIGN.md › Image placeholders), with a small muted note `图片即将更新` in the corner. Do not reuse the c0 photos for another colour — the colour must match.
- Product cards: `c0-1` as the main image, `c0-2` on hover (desktop).

Post-process every image with `sharp`: convert to WebP quality 82, max 1200 px on the long side, strip metadata. Keep the repo's total image size under ~20 MB for Phase 1.

Then add to each product in `data/products.json` (Phase 1):
```json
"images": { "c0": ["/products/<slug>/c0-1.webp", "/products/<slug>/c0-2.webp"] }
```
(`images?: Record<string, string[]>`, ordered for the gallery). Any colour without an entry falls back to the tinted placeholder.

## Visual direction

**Reference feel:** the product pages of premium contemporary fast-fashion stores in the vein of Aritzia and Zara — but never write any brand name into an image prompt, and never reproduce their logos, labels, signature products or campaigns. Translate the feel into the descriptions below.

One cohesive catalogue, as if a single studio and casting shot everything.

**Models**
- Fictional AI models (no celebrity or real-person likeness). Women in their 20s, tall and slim-to-average. **Cast: about 70% white models and 30% East Asian models across the on-model shots; no other casting.** Re-use a small consistent cast of ~5 recurring models across the catalogue (3–4 white, 1–2 East Asian), and keep each product's shots on the same model.
- Natural, minimal makeup; hair sleek or effortlessly loose; calm, confident, slightly serious expression — editorial, not smiling-catalogue.
- Poses: relaxed and understated — weight on one leg, hands in pockets, adjusting a collar, mid-stride. Full-length framing for outfits and shoes, three-quarter length for tops.
- Styling: each hero piece styled with simple neutral basics (white tee, black trousers, straight jeans, ankle boots) so the product stays the focus. No props, no jewellery stacks, no visible logos.

**Studio & light**
- Seamless backdrop in warm light grey / off-white (#EEECE8), occasionally a pale stone/concrete tone for variety in campaign shots.
- Soft, diffused, even daylight-like light; gentle natural shadow on the floor; true-to-life colour, slightly muted and matte, no heavy contrast or filters.
- Portrait 2:3 (1024×1536), subject centred with clean negative space; consistent camera height and framing across products of the same category.

**Product close-ups**
- Macro-style detail of the actual garment/shoe in the listed colour: weave and texture of wool, sheen of satin, rib of knit, grain of leather, denim twill, stitching, hardware. Shoes: heel shape and height, toe, sole edge, shaft fit.
- Shallow depth of field, same backdrop and light.

**Campaign / hero**
- Winter lookbook mood: long coats, puffers, knee boots; minimal studio set or quiet city street at golden hour with a Toronto feel (no identifiable signage or text). Wide negative space on one side for the headline.

**Never**: logos, brand marks, text, labels, watermarks; recognisable real products or people; mannequins or stands; busy props or backgrounds; oversaturated colours; warped hands, extra fingers or limbs, deformed shoes; sexualised poses. Colours must match the product's colour name and hex closely.

## Prompt templates

On-model, front (`-1`):
```
Premium minimalist fashion e-commerce photo. A young {model: from the recurring cast, e.g. white Scandinavian-looking} woman model, natural minimal makeup, calm confident editorial expression,
wearing a {colorName} ({hex}) {nameEn} — {description} — styled with simple neutral basics ({styling}).
{Full-length | three-quarter} framing, relaxed understated pose. Seamless warm light-grey backdrop #EEECE8, soft diffused daylight,
gentle floor shadow, true-to-life muted colour, portrait 2:3. No logos, no text, no props.
```

Phase 2 only — on-model, second pose (`-3`): same as above with "3/4 turn / side profile / walking mid-stride / back view showing the {back detail}".

Product close-up (`-2`):
```
Close-up detail photo of a {colorName} ({hex}) {nameEn}: {material from details[0]}, showing {texture / stitching / hardware / heel and toe shape}.
Shallow depth of field, seamless warm light-grey backdrop #EEECE8, soft diffused daylight, premium fashion catalogue style, portrait 2:3. No logos, no text.
```

Clean product shot (`-p`):
```
E-commerce studio product photo of a {nameEn} in {colorName} ({hex}), {apparel: invisible ghost-mannequin front view | skirts/pants: neat flat lay from above | shoes: single shoe, 3/4 side angle slightly from above, full shaft for boots}.
Seamless warm light-grey background #EEECE8, soft diffused light, subtle natural shadow, centred with generous margins, portrait 2:3. No logos, no text, no people.
```
