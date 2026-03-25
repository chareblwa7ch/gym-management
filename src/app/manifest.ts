import type { MetadataRoute } from "next";
import { GYM_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: GYM_NAME,
    short_name: "ESF Gym",
    description: "Private membership management dashboard for ElAmidy Sports Fitness.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1f232b",
    theme_color: "#df6b5d",
    categories: ["business", "productivity", "sports"],
    icons: [
      {
        src: "/pwa-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
