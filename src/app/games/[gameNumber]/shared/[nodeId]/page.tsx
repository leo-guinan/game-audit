import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameConfig, getGameContent } from "@/lib/games";
import { MarkdownWithRoutes, PathBreadcrumb } from "@/components/games";
import { gameBasePath } from "@/lib/games/routes";

const VALID_NODE_IDS = ["core_problem", "cycle"] as const;

export default async function GameSharedNodePage({
  params,
}: { params: Promise<{ gameNumber: string; nodeId: string }> }) {
  const { gameNumber: raw, nodeId } = await params;
  const gameNumber = parseInt(raw, 10);
  if (gameNumber < 1 || gameNumber > 6) notFound();
  if (!VALID_NODE_IDS.includes(nodeId as (typeof VALID_NODE_IDS)[number])) notFound();

  const config = getGameConfig(gameNumber);
  if (!config) notFound();

  const nodeConfig = config.shared_nodes[nodeId as keyof typeof config.shared_nodes];
  if (!nodeConfig) notFound();

  const content = getGameContent(gameNumber, { type: "shared", nodeId });
  const base = gameBasePath(gameNumber);

  const breadcrumbs = [
    { label: "Games", href: "/games" },
    { label: config.game_name, href: base },
    { label: nodeConfig.title, current: true as const },
  ];

  return (
    <article>
      <PathBreadcrumb items={breadcrumbs} className="mb-6" />
      <header className="mb-8">
        <div className="font-mono text-xs uppercase tracking-wider text-primary mb-2">
          {config.game_name} · Shared node
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {nodeConfig.title}
        </h1>
        <p className="text-muted-foreground italic mt-1">{nodeConfig.subtitle}</p>
      </header>

      {content ? (
        <MarkdownWithRoutes
          content={content}
          gameNumber={gameNumber}
          config={config}
        />
      ) : (
        <div className="insight-box p-8">
          <p className="text-muted-foreground mb-4">Content for this node is coming soon.</p>
          <Link href={`${base}/fork`} className="font-mono text-sm text-primary hover:underline">
            ← Back to fork
          </Link>
        </div>
      )}
    </article>
  );
}
