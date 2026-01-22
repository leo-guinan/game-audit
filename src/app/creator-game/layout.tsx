import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Creator Game | 6-Day Email Course | MetaSPN",
  description:
    "A free 6-day email course on the invisible games creators play. See which game you're actually playing—and why good content isn't compounding.",
};

export default function CreatorGameLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
