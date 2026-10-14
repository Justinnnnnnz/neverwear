import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    localPatterns: [
      { pathname: "/products/**", search: "" },
      { pathname: "/products/**", search: "?v=20261014" },
      { pathname: "/campaign/**", search: "" },
      { pathname: "/campaign/**", search: "?v=20261014" },
    ],
  },
};
export default nextConfig;
