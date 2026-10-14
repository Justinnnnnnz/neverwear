"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
export function Hero() {
  const [index, setIndex] = useState(0);
  return (
    <div className="hero">
      <div className="hero-copy">
        <p className="eyebrow muted">FW26 · 冬季上新</p>
        <h1 className="display">
          The Winter
          <br className="desktop-only" /> Edit
        </h1>
        <p className="hero-description">
          长大衣、羽绒服和细跟靴。
          <br />
          FW26 冬季系列现已上新。
        </p>
        <div className="row">
          <Link href="/new" className="btn">
            选购新品
          </Link>
          <Link href="/c/outerwear" className="btn secondary desktop-only">
            外套系列
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <Image
          src={`/campaign/hero-${index + 1}.webp`}
          alt={
            index === 0
              ? "冬季穿搭：驼色长大衣与巧克力棕细跟靴"
              : "冬季穿搭：黑色羽绒服与针织长裙"
          }
          fill
          priority
          sizes="(max-width:1023px) 100vw, 60vw"
        />
        <div className="hero-controls" role="group" aria-label="冬季大片">
          {[0, 1].map((i) => (
            <button
              key={i}
              aria-label={`${String(i + 1).padStart(2, "0")} · 查看大片`}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
