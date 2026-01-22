"use client";

import Link from "next/link";
import {
  gameNodeHref,
  defaultRouteLabel,
} from "@/lib/games/routes";
import type { GameConfig } from "@/lib/games/types";
import { trackFathomEvent, GameEvents } from "@/lib/analytics/fathom";
import { addPathStep } from "@/lib/analytics/path-tracker";

interface CrossLinkProps {
  gameNumber: number;
  target: string;
  label?: string;
  config: GameConfig | null;
  className?: string;
  /** Current node type for tracking "from" state */
  fromNodeType?: "intro" | "fork" | "path" | "shared" | "ending";
  fromNodeId?: string;
}

/** Renders a single cross-link to another game node, or raw [target] if not a route (e.g. email_01_identity). */
export function CrossLink({
  gameNumber,
  target,
  label,
  config,
  className = "",
  fromNodeType,
  fromNodeId,
}: CrossLinkProps) {
  const href = gameNodeHref(gameNumber, target);
  const text = label ?? defaultRouteLabel(target, config);

  // Determine target node type
  const getTargetNodeType = (): { type: "intro" | "fork" | "path" | "shared" | "ending"; id?: string } => {
    if (target === "intro") return { type: "intro" };
    if (target === "fork") return { type: "fork" };
    if (target === "ending") return { type: "ending" };
    if (target.startsWith("path_")) return { type: "path", id: target };
    if (target === "core_problem" || target === "cycle") return { type: "shared", id: target };
    if (target.startsWith("game_")) {
      const num = parseInt(target.replace("game_", ""), 10);
      return { type: "intro" }; // Cross-game link goes to intro
    }
    return { type: "intro" };
  };

  const handleClick = () => {
    if (!href) return;

    const targetNode = getTargetNodeType();
    const from = fromNodeType ? `${fromNodeType}${fromNodeId ? `_${fromNodeId}` : ""}` : "unknown";
    const to = `${targetNode.type}${targetNode.id ? `_${targetNode.id}` : ""}`;

    // Track Fathom event
    trackFathomEvent(GameEvents.pathClick(gameNumber, from, to));

    // Add to path tracker
    if (target.startsWith("game_")) {
      const targetGame = parseInt(target.replace("game_", ""), 10);
      addPathStep({ gameNumber: targetGame, nodeType: "intro" });
    } else {
      addPathStep({
        gameNumber,
        nodeType: targetNode.type,
        nodeId: targetNode.id,
      });
    }
  };

  if (href == null || text == null) {
    return <span className={`font-mono text-sm text-muted-foreground ${className}`}>[{target}]</span>;
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`font-mono text-sm text-primary hover:underline ${className}`}
    >
      {text}
    </Link>
  );
}
