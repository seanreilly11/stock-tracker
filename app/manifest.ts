import { MetadataRoute } from "next";
import { APP_TITLE } from "@/lib/utils/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_TITLE,
    short_name: APP_TITLE,
    description:
      "Track stock intentions and keep personal notes alongside real-time data.",
    start_url: "/",
    display: "standalone",
    theme_color: "#faf9f5",
    background_color: "#faf9f5",
    icons: [],
  };
}
