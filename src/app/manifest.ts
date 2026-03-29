import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrueHabit — Science-based Nutrition",
    short_name: "TrueHabit",
    description:
      "Personalized nutrition plans backed by science. Your path to healthier habits.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8bc34a",
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
