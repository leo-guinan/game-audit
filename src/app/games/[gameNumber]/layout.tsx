import { notFound } from "next/navigation";
import { getGames, getGameConfig } from "@/lib/games";
import { GameSwitcher } from "@/components/games";

function isValidGameNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 6;
}

export default async function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ gameNumber: string }>;
}) {
  const { gameNumber: raw } = await params;
  const gameNumber = parseInt(raw, 10);
  if (!isValidGameNumber(gameNumber)) notFound();

  const config = getGameConfig(gameNumber);
  if (!config) notFound();

  const games = getGames();

  return (
    <main className="container mx-auto max-w-3xl px-6 sm:px-8 py-12">
      <GameSwitcher currentGameNumber={gameNumber} games={games} className="mb-8" />
      {children}
    </main>
  );
}
