import type { Metadata } from "next";
import { Bodoni_Moda, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
const display = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body", display: "swap" });
export const metadata: Metadata = { title: "NEVERWEAR · 精选日常衣橱", description: "FW26 冬季系列。探索外套、上衣、裙装与鞋履。" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>; }
