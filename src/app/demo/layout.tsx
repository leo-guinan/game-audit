import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaSPN – Interactive Alignment Simulator",
  description: "Same content. Different games. Different outcomes. See how alignment changes everything.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
