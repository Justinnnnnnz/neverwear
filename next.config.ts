import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";
const nextConfig: NextConfig = {
  devIndicators: false,
  // Only this computer's actual interface addresses can load dev assets over LAN.
  allowedDevOrigins: [
    ...new Set(
      Object.values(networkInterfaces()).flatMap((entries) =>
        (entries ?? [])
          .filter((entry) => entry.family === "IPv4")
          .map((entry) => entry.address),
      ),
    ),
  ],
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
