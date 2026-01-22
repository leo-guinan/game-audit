import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "6 Games | Choose Your Own Adventure",
  description:
    "Six interactive games exploring identity, ideas, models, performance, meaning, and coordination. Choose your path.",
};

export default function GamesLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <footer className="py-8 mt-16 border-t border-border">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              MetaSPN
            </Link>
            <Link href="/games" className="text-muted-foreground hover:text-primary transition-colors">
              Games
            </Link>
            <Link href="/discover" className="text-muted-foreground hover:text-primary transition-colors">
              Discover
            </Link>
            <Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">
              Compare
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
