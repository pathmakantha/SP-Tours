import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SP Tours — Custom Sri Lanka Travel Planning",
    short_name: "SP Tours",
    description:
      "Plan a custom Sri Lanka tour with private driver-guides: cultural triangle, hill country, wildlife safaris and south coast beaches.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffcf6",
    theme_color: "#10312f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
