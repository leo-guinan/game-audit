import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameConfig, getGameContent } from "@/lib/games";
import { MarkdownWithRoutes, PathBreadcrumb } from "@/components/games";
import { gameBasePath } from "@/lib/games/routes";

const VALID_PATH_IDS = ["path_a", "path_b", "path_c"] as const;

export default async function GamePathPage({
  params,
}: { params: Promise<{ gameNumber: string; pathId: string }> }) {
  const { gameNumber: raw, pathId } = await params;
  const gameNumber = parseInt(raw, 10);
  if (gameNumber < 1 || gameNumber > 6) notFound();
  if (!VALID_PATH_IDS.includes(pathId as (typeof VALID_PATH_IDS)[number])) notFound();

  const config = getGameConfig(gameNumber);
  if (!config) notFound();

  const pathConfig = config.paths[pathId as keyof typeof config.paths];
  if (!pathConfig) notFound();

  const content = getGameContent(gameNumber, { type: "path", pathId });
  const base = gameBasePath(gameNumber);

  const breadcrumbs = [
    { label: "Games", href: "/games" },
    { label: config.game_name, href: base },
    { label: "Fork", href: `${base}/fork` },
    { label: pathConfig.title, current: true as const },
  ];

  return (
    <article>
      <PathBreadcrumb items={breadcrumbs} className="mb-6" />
      <header className="mb-8">
        <div className="font-mono text-xs uppercase tracking-wider text-primary mb-2">
          {config.game_name} · Path
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {pathConfig.title}
        </h1>
      </header>

      {content ? (
        <MarkdownWithRoutes
          content={content}
          gameNumber={gameNumber}
          config={config}
        />
      ) : (
        <div className="insight-box p-8">
          <p className="text-muted-foreground mb-4">Content for this path is coming soon.</p>
          <Link href={`${base}/fork`} className="font-mono text-sm text-primary hover:underline">
            ← Back to fork
          </Link>
        </div>
      )}
    </article>
  );
}
