import Link from "next/link";
import { getGames } from "@/lib/games";

export default function GamesLandingPage() {
  const games = getGames();

  return (
    <main className="container mx-auto max-w-4xl px-6 sm:px-8 py-16">
      <div className="mb-16">
        <div className="section-label mb-4">Choose Your Own Adventure</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          6 Games Framework
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Each game follows the same structure: an intro, a fork with three entry points,
          paths that explore failure modes, shared nodes (core problem + cycle), and an ending.
          Choose a game to begin.
        </p>
      </div>

      <div className="games-grid">
        {games.map(({ gameNumber, config }) => (
          <Link
            key={gameNumber}
            href={`/games/${gameNumber}`}
            className="game-card block group"
            data-number={config.game_number}
          >
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {config.game_name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 italic">
              &ldquo;{config.essay_title}&rdquo;
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {config.core_question}
            </p>
            <ul className="mt-4 space-y-1">
              <li>Path A: {config.paths?.path_a?.title ?? "—"}</li>
              <li>Path B: {config.paths?.path_b?.title ?? "—"}</li>
              <li>Path C: {config.paths?.path_c?.title ?? "—"}</li>
            </ul>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-center text-muted-foreground text-sm">
        Start with <Link href="/games/1" className="text-primary hover:underline">Game 1: Identity / Canon</Link> →
      </p>
    </main>
  );
}
