"use client";
import { toPng } from "html-to-image";
export async function exportImage(
  node: HTMLElement,
  filename: string,
  width: number,
  height: number,
) {
  await document.fonts.ready;
  const data = await toPng(node, {
    width,
    height,
    pixelRatio: 1,
    backgroundColor: "#F7F6F3",
    skipFonts: true,
    style: {
      position: "static",
      left: "auto",
      top: "auto",
      width: `${width}px`,
      height: `${height}px`,
      transform: "none",
    },
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = data;
  link.click();
}
