import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "MetaSPN – See the games you play online",
  description: "Most creators lose because they can't see which game they're in. The platforms see it. The AI companies see it. You should too.",
};

export default function Home() {
  return <HomeClient />;
}
