import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaSPN – Request a Game Audit",
  description: "This audit is diagnostic, not coaching. You will receive clear judgment and structural feedback.",
};

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
