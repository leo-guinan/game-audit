/**
 * Resolve game route targets to URLs and labels.
 * Normalize config targets like path_b_trap → path_b, elevation → ending.
 */

import type { GameConfig } from "./types";

const PATH_IDS = ["path_a", "path_b", "path_c"] as const;
const SHARED_IDS = ["core_problem", "cycle"] as const;
const GAME_IDS = ["game_1", "game_2", "game_3", "game_4", "game_5", "game_6"] as const;

export const VALID_ROUTE_TARGETS = new Set<string>([
  "intro", "fork", "ending", "elevation", "games",
  ...PATH_IDS,
  ...SHARED_IDS,
  ...GAME_IDS,
]);

/** path_b_trap → path_b; elevation → ending; game_N; unknown → null */
function normalizeTarget(target: string): string | null {
  if (target === "elevation") return "ending";
  if (/^path_[abc]_/.test(target)) return target.replace(/^(path_[abc]).*/, "$1") as string;
  if (target === "games") return "games";
  if (/^game_[1-6]$/.test(target)) return target;
  if (VALID_ROUTE_TARGETS.has(target)) return target;
  return null;
}

/** Base path for a game (e.g. /games/1) */
export function gameBasePath(gameNumber: number): string {
  return `/games/${gameNumber}`;
}

/** URL for a game node (intro, fork, path, shared, ending) or cross-game (games, game_1..game_6). Returns null if target is not a route. */
export function gameNodeHref(
  gameNumber: number,
  target: string
): string | null {
  const n = normalizeTarget(target);
  if (!n) return null;
  if (n === "games") return "/games";
  if (GAME_IDS.includes(n as (typeof GAME_IDS)[number])) {
    const num = parseInt(n.replace("game_", ""), 10);
    return `/games/${num}`;
  }
  const base = gameBasePath(gameNumber);
  if (n === "intro") return base;
  if (n === "fork") return `${base}/fork`;
  if (n === "ending") return `${base}/ending`;
  if (PATH_IDS.includes(n as (typeof PATH_IDS)[number])) return `${base}/path/${n}`;
  if (SHARED_IDS.includes(n as (typeof SHARED_IDS)[number])) return `${base}/shared/${n}`;
  return base;
}

const GAME_LABELS: Record<string, string> = {
  game_1: "Game 1: Identity",
  game_2: "Game 2: Ideas",
  game_3: "Game 3: Models",
  game_4: "Game 4: Performance",
  game_5: "Game 5: Meaning",
  game_6: "Game 6: Network",
};

/** Default label for a route target (when not overridden by **→ ...** [target]). Returns null if not a route. */
export function defaultRouteLabel(
  target: string,
  config: GameConfig | null
): string | null {
  const n = normalizeTarget(target);
  if (!n) return null;
  if (n === "intro") return "Introduction";
  if (n === "fork") return "Choose your path";
  if (n === "ending") return "Resolution + next steps";
  if (n === "games") return "The 6 Games Overview";
  if (GAME_LABELS[n]) return GAME_LABELS[n];
  if (n === "path_a" && config?.paths?.path_a) return config.paths.path_a.title;
  if (n === "path_b" && config?.paths?.path_b) return config.paths.path_b.title;
  if (n === "path_c" && config?.paths?.path_c) return config.paths.path_c.title;
  if (n === "core_problem" && config?.shared_nodes?.core_problem)
    return config.shared_nodes.core_problem.title;
  if (n === "cycle" && config?.shared_nodes?.cycle)
    return config.shared_nodes.cycle.title;
  return "Continue";
}
