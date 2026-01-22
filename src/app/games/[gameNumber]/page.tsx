import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameConfig, getGameContent } from "@/lib/games";
import {
  ForkSelector,
  MarkdownWithRoutes,
  PathBreadcrumb,
} from "@/components/games";
import { gameBasePath } from "@/lib/games/routes";

export default async function GameIntroPage({
  params,
}: { params: Promise<{ gameNumber: string }> }) {
  const gameNumber = parseInt((await params).gameNumber, 10);
  if (gameNumber < 1 || gameNumber > 6) notFound();

  const config = getGameConfig(gameNumber);
  if (!config) notFound();

  const content = getGameContent(gameNumber, { type: "intro" });

  const base = gameBasePath(gameNumber);
  const breadcrumbs = [
    { label: "Games", href: "/games" },
    { label: config.game_name, href: base },
    { label: "Intro", current: true as const },
  ];

  return (
    <article>
      <PathBreadcrumb items={breadcrumbs} className="mb-6" />
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {config.essay_title}
        </h1>
        <p className="text-lg text-muted-foreground italic">{config.subtitle}</p>
        <p className="mt-4 text-muted-foreground font-medium">{config.core_question}</p>
      </header>

      {content ? (
        <MarkdownWithRoutes
          content={content}
          gameNumber={gameNumber}
          config={config}
        />
      ) : (
        <div className="insight-box p-8">
          <p className="text-muted-foreground mb-4">Content for this game is coming soon.</p>
          <Link href={`${base}/fork`} className="font-mono text-sm text-primary hover:underline">
            Go to fork →
          </Link>
        </div>
      )}

      <section className="mt-12 pt-10 border-t border-border">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Ready to choose your entry point?
        </h2>
        <p className="text-muted-foreground mb-6">
          Three doors. Pick the one that resonates.
        </p>
        <ForkSelector
          gameNumber={gameNumber}
          options={config.fork_options}
        />
      </section>
    </article>
  );
}
