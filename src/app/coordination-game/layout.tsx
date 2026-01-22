import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Coordination Game | MetaSPN",
  description:
    "Weekly insights on the invisible games governing trust, alignment, and collective action. Published every Monday.",
};

export default function CoordinationGameLayout({
  children,
}: { children: React.ReactNode }) {
  return <>{children}</>;
}
