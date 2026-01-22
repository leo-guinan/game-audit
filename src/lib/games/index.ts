import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { GameConfig } from "./types";

const GAMES_BASE = join(process.cwd(), "src", "lib", "games");

function gameDir(n: number): string {
  return join(GAMES_BASE, `GAME_${n}`);
}

/** All game numbers 1–6 */
export const GAME_NUMBERS = [1, 2, 3, 4, 5, 6] as const;

/** Load config for a game. Throws if missing or invalid. */
export function getGameConfig(gameNumber: number): GameConfig | null {
  const path = join(gameDir(gameNumber), "config.json");
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8");
  return JSON.parse(raw) as GameConfig;
}

/** List all games with configs. */
export function getGames(): Array<{ gameNumber: number; config: GameConfig }> {
  const out: Array<{ gameNumber: number; config: GameConfig }> = [];
  for (const n of GAME_NUMBERS) {
    const config = getGameConfig(n);
    if (config) out.push({ gameNumber: n, config });
  }
  return out;
}

export type ContentNode =
  | { type: "intro" }
  | { type: "fork" }
  | { type: "path"; pathId: string }
  | { type: "shared"; nodeId: string }
  | { type: "ending" };

/** Resolve content file path for a node. */
function contentPath(gameNumber: number, node: ContentNode): string {
  const base = gameDir(gameNumber);
  switch (node.type) {
    case "intro":
      return join(base, "intro.md");
    case "fork":
      return join(base, "fork.md");
    case "path":
      return join(base, "paths", `${node.pathId}.md`);
    case "shared":
      return join(base, "shared_nodes", `${node.nodeId}.md`);
    case "ending":
      return join(base, "ending.md");
    default:
      return "";
  }
}

/** Load markdown content for a game node. Returns null if file missing. */
export function getGameContent(
  gameNumber: number,
  node: ContentNode
): string | null {
  const path = contentPath(gameNumber, node);
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf-8");
}
