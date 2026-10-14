import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { PWA } from "@/components/pwa";
import { SiteLayout } from "@/components/layout";
const display = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body", display: "swap" });
export const metadata: Metadata = { title: "NEVERWEAR · 精选日常衣橱", description: "FW26 冬季系列。探索外套、上衣、裙装与鞋履。", icons: { apple: "/icons/apple-touch-icon.png", icon: "/icons/icon-192.png" }, appleWebApp: { capable: true, title: "NeverWear", statusBarStyle: "default" } };
export const viewport: Viewport = { themeColor: "#141414", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body className={`${display.variable} ${body.variable}`}><PWA/><SiteLayout>{children}</SiteLayout></body></html>; }
