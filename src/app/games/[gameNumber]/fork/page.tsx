import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameConfig, getGameContent } from "@/lib/games";
import {
  ForkSelector,
  GameTracker,
  MarkdownWithRoutes,
  PathBreadcrumb,
} from "@/components/games";
import { gameBasePath } from "@/lib/games/routes";

export default async function GameForkPage({
  params,
}: { params: Promise<{ gameNumber: string }> }) {
  const gameNumber = parseInt((await params).gameNumber, 10);
  if (gameNumber < 1 || gameNumber > 6) notFound();

  const config = getGameConfig(gameNumber);
  if (!config) notFound();

  const content = getGameContent(gameNumber, { type: "fork" });
  const base = gameBasePath(gameNumber);

  const breadcrumbs = [
    { label: "Games", href: "/games" },
    { label: config.game_name, href: base },
    { label: "Fork", current: true as const },
  ];

  return (
    <GameTracker gameNumber={gameNumber} nodeType="fork">
      <article>
        <PathBreadcrumb items={breadcrumbs} className="mb-6" />
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Choose your entry point
          </h1>
          <p className="text-muted-foreground">
            Three doors. Pick the one that resonates.
          </p>
        </header>

        {content && (
          <div className="mb-10">
            <MarkdownWithRoutes
              content={content}
              gameNumber={gameNumber}
              config={config}
              fromNodeType="fork"
            />
          </div>
        )}

        <ForkSelector
          gameNumber={gameNumber}
          options={config.fork_options}
          className="mb-10"
        />

        <p className="text-sm text-muted-foreground">
          <Link href={base} className="text-primary hover:underline">
            ← Back to intro
          </Link>
        </p>
      </article>
    </GameTracker>
  );
}
