export const shoeSizes = [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
];
export const euSizes = [
  "35.5",
  "36",
  "36.5",
  "37",
  "37.5",
  "38",
  "38.5",
  "39",
  "40",
  "40.5",
  "41",
];
export const footLengths = [
  "220",
  "225",
  "230",
  "235",
  "240",
  "245",
  "250",
  "255",
  "260",
  "265",
  "270",
];
export function convertShoeSize(us: string, unit: "US" | "EU" | "CN") {
  const i = shoeSizes.indexOf(us);
  return i < 0
    ? us
    : unit === "EU"
      ? euSizes[i]
      : unit === "CN"
        ? footLengths[i]
        : us;
}
