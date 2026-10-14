import Image from "next/image";
import type { Product } from "@/types";
const shapes: Record<string, string> = {
  coats:
    "M38 18 25 25 16 63 28 66 35 44 30 112 70 112 65 44 72 66 84 63 75 25 62 18 50 30Z M50 30V112 M38 18L50 46 62 18 M36 78H44 M56 78H64",
  puffers:
    "M35 20 23 28 14 68 28 73 34 51 32 105 68 105 66 51 72 73 86 68 77 28 65 20 50 26Z M50 26V105 M34 44H66 M34 62H66 M33 82H67",
  jackets:
    "M36 26 24 32 14 76 27 80 35 52 34 90 66 90 65 52 73 80 86 76 76 32 64 26 50 40Z M50 40V90 M36 26L47 57 40 61",
  blazers:
    "M36 23 23 30 16 85 29 87 35 51 32 105 68 105 65 51 71 87 84 85 77 30 64 23 50 35Z M36 23L50 65 64 23 M50 65V105",
  tees: "M35 30 22 36 11 56 27 64 33 55 33 99 67 99 67 55 73 64 89 56 78 36 65 30Q50 43 35 30Z",
  knits:
    "M35 25 24 31 13 82 27 87 34 53 32 103 68 103 66 53 73 87 87 82 76 31 65 25Q50 39 35 25Z M41 42V95 M50 42V95 M59 42V95",
  shirts:
    "M37 25 24 31 15 86 28 88 35 54 32 104 68 104 65 54 72 88 85 86 76 31 63 25 50 36Z M50 36V104 M37 25L44 47 50 36 56 47 63 25",
  skirts:
    "M35 35H65L81 111H19Z M35 43H65 M40 43L33 111 M50 43V111 M60 43L67 111",
  dresses: "M36 20 28 48 38 60 24 115H76L62 60 72 48 64 20 57 35H43Z M38 60H62",
  trousers: "M31 25H69L74 115H54L50 55 46 115H26Z M31 35H69 M50 35V55",
  shorts: "M29 37H71L76 88H53L50 61 47 88H24Z M29 47H71",
  boots:
    "M43 17H70L66 84Q72 96 84 103V113H52L41 103 38 116H29L33 86Z M43 29H69",
  pumps:
    "M18 78 35 63Q48 91 62 83L78 58 84 66 80 105H74L72 86Q63 105 44 105H17Q9 96 18 78Z",
  sandals:
    "M20 92Q27 80 55 90L70 70 80 75 76 110H68L66 93Q53 112 18 107Z M37 88L40 65 60 63 64 89 M40 65L44 57H61L60 63",
  slingbacks:
    "M16 91 36 76Q52 91 62 88L72 66 80 70 75 108H69L68 92Q52 109 16 105Z M36 76L43 67 60 70 62 88",
  mules:
    "M16 93Q29 81 55 88L73 75 81 79 77 110H69L67 93Q49 112 16 107Z M30 90L35 72H54L59 91",
  shoe: "M15 75 31 69 38 46 55 57 58 75 80 85Q91 88 89 105H14Z M15 96H89 M37 62L53 67 M34 71L56 77",
};
export function ProductImage({
  product,
  color = 0,
  index = 0,
  priority = false,
  className = "",
}: {
  product: Product;
  color?: number;
  index?: number;
  priority?: boolean;
  className?: string;
}) {
  const photo = product.images?.[`c${color}`]?.[index];
  const col = product.colors[color] ?? product.colors[0];
  const shape =
    shapes[product.subcategory] ??
    (product.sizeType === "shoe" ? shapes.shoe : shapes.trousers);
  return (
    <div
      className={`product-image ${className}`}
      style={{ backgroundColor: photo ? "#EEECE8" : col.hex }}
    >
      {photo ? (
        <Image
          src={`${photo}?v=20261014`}
          alt={`${product.name} · ${col.name} · ${index === 0 ? "正面穿搭" : "细节"}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          style={{
            objectFit: index === 0 ? "contain" : "cover",
            objectPosition: "center",
          }}
        />
      ) : (
        <>
          <svg
            viewBox="0 0 100 135"
            aria-hidden="true"
            className="silhouette"
            style={{
              color:
                parseInt(col.hex.slice(1, 3), 16) < 110 ? "#fff" : "#141414",
              opacity: index % 2 ? 0.3 : 0.4,
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          >
            <path d={shape} />
          </svg>
          {color > 0 && <span className="placeholder-note">图片即将更新</span>}
        </>
      )}
    </div>
  );
}
