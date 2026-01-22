/**
 * Choose Your Own Adventure: 6 Games Framework
 * Config schema and route types.
 */

export interface ForkOption {
  id: string;
  label: string;
  description: string;
}

export interface PathConfig {
  title: string;
  sections: string[];
  routes_to: string[];
}

export interface SharedNodeConfig {
  title: string;
  subtitle: string;
}

export interface GameConfig {
  game_number: number;
  game_name: string;
  essay_title: string;
  subtitle: string;
  core_question: string;
  fork_options: ForkOption[];
  paths: Record<string, PathConfig>;
  shared_nodes: Record<string, SharedNodeConfig>;
  connections: {
    related_games: number[];
    email_course_link: string;
  };
}

export type GameNodeType = "intro" | "fork" | "path" | "shared" | "ending";

export type PathId = `path_${"a" | "b" | "c"}`;
export type SharedNodeId = "core_problem" | "cycle";

/** Route target: path (path_a/b/c), shared (core_problem, cycle), or ending */
export function isPathId(id: string): id is PathId {
  return /^path_[abc]$/.test(id);
}

export function isSharedNodeId(id: string): id is SharedNodeId {
  return id === "core_problem" || id === "cycle";
}
