import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameConfig, getGameContent } from "@/lib/games";
import { MarkdownWithRoutes, PathBreadcrumb } from "@/components/games";
import { gameBasePath } from "@/lib/games/routes";

export default async function GameEndingPage({
  params,
}: { params: Promise<{ gameNumber: string }> }) {
  const gameNumber = parseInt((await params).gameNumber, 10);
  if (gameNumber < 1 || gameNumber > 6) notFound();

  const config = getGameConfig(gameNumber);
  if (!config) notFound();

  const content = getGameContent(gameNumber, { type: "ending" });
  const base = gameBasePath(gameNumber);

  const breadcrumbs = [
    { label: "Games", href: "/games" },
    { label: config.game_name, href: base },
    { label: "Resolution + next steps", current: true as const },
  ];

  return (
    <article>
      <PathBreadcrumb items={breadcrumbs} className="mb-6" />
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Resolution + next steps
        </h1>
        <p className="text-muted-foreground mt-2">{config.essay_title}</p>
      </header>

      {content ? (
        <MarkdownWithRoutes
          content={content}
          gameNumber={gameNumber}
          config={config}
        />
      ) : (
        <div className="insight-box p-8">
          <p className="text-muted-foreground mb-4">Content for the ending is coming soon.</p>
          <Link href={base} className="font-mono text-sm text-primary hover:underline">
            ← Back to intro
          </Link>
        </div>
      )}
    </article>
  );
}
