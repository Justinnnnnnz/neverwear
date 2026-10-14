export const SUBCATEGORY_LABELS: Readonly<Record<string, string>> = {
  coats: "大衣",
  puffers: "羽绒服",
  jackets: "夹克",
  blazers: "西装外套",
  tees: "T-shirt",
  knits: "针织衫",
  shirts: "衬衫",
  skirts: "半裙",
  dresses: "连衣裙",
  trousers: "西裤",
  jeans: "牛仔裤",
  shorts: "短裤",
  runners: "跑鞋",
  court: "板鞋",
  platform: "厚底鞋",
  boots: "靴子",
  pumps: "单鞋",
  sandals: "凉鞋",
  slingbacks: "后空鞋",
  mules: "穆勒鞋",
  "mary-janes": "玛丽珍鞋",
};
const warned = new Set<string>();
export function subcategoryLabel(slug: string): string {
  if (SUBCATEGORY_LABELS[slug]) return SUBCATEGORY_LABELS[slug];
  if (process.env.NODE_ENV === "development" && !warned.has(slug)) {
    console.warn(`Missing subcategory label: ${slug}`);
    warned.add(slug);
  }
  return slug;
}
