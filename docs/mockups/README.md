# Mockups

Six approved reference screens exported from the design canvas:

| File | Screen |
|---|---|
| `Main.dc.html` | Desktop home |
| `Product.dc.html` | Desktop product detail (size / colour / unit interactions) |
| `MobileHome.dc.html` | Mobile home (390 × 844) |
| `MobileProduct.dc.html` | Mobile product detail |
| `Cart.dc.html` | Mobile cart |
| `Tracking.dc.html` | Mobile order confirmation + tracking |

How to read them: they are HTML with inline styles written for a design tool. `{{name}}` holes, `<sc-for>` (loop), `<sc-if>` (conditional) and the `<script type="text/x-dc">` block (sample data and interaction logic) are design-tool template syntax — they will not render if opened directly in a browser. Use them as the source of truth for **layout, spacing, sizes, colours and copy**, and re-implement them as React components with Tailwind. Do not copy the template syntax into the app.

Where a mockup and `docs/SPEC.md` disagree on behaviour, the spec wins; on look and copy, the mockup wins.
