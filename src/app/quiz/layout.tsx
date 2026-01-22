import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaSPN – Game Identification Diagnostic",
  description: "Answer quickly. Choose the option that feels most true, not what you aspire to. This is about how you actually operate today.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
