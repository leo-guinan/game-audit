import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaSPN – Your Game Result",
  description: "Discover which creator game you're playing and why it's not working yet.",
};

export default function QuizResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
