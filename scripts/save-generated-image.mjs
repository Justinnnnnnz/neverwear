import sharp from "sharp";
import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  unlink,
  stat,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";
const [source, target, mode] = process.argv.slice(2);
if (!source || !target)
  throw new Error(
    "Usage: node scripts/save-generated-image.mjs SOURCE MANIFEST_PATH",
  );
const manifest = JSON.parse(await readFile("data/image-manifest.json", "utf8"));
if (!manifest[target]) throw new Error("Target is not in the Phase 1 manifest");
try {
  await stat(target);
  if (mode !== "--replace") throw new Error("Target already exists; use --replace only for an authorized replacement");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await mkdir(dirname(target), { recursive: true });
const raw = target.replace(/\.webp$/, ".generated.png");
await copyFile(source, raw);
await sharp(raw)
  .rotate()
  .resize({
    width: 1200,
    height: 1200,
    fit: "inside",
    withoutEnlargement: true,
  })
  .webp({ quality: 82 })
  .toFile(target);
await unlink(raw);
// Move the selected generated file into the project and keep only the processed asset.
if (resolve(source).includes("/generated_images/")) await unlink(source);
manifest[target].status = "done";
await writeFile(
  "data/image-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
const products = JSON.parse(await readFile("data/products.json", "utf8"));
for (const p of products) {
  const paths = [1, 2]
    .map((i) => `public/products/${p.slug}/c0-${i}.webp`)
    .filter((path) => manifest[path]?.status === "done");
  if (paths.length)
    p.images = { ...p.images, c0: paths.map((path) => path.slice(6)) };
}
await writeFile("data/products.json", JSON.stringify(products, null, 2) + "\n");
console.log(target);
