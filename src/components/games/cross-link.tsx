"use client";

import Link from "next/link";
import {
  gameNodeHref,
  defaultRouteLabel,
} from "@/lib/games/routes";
import type { GameConfig } from "@/lib/games/types";

interface CrossLinkProps {
  gameNumber: number;
  target: string;
  label?: string;
  config: GameConfig | null;
  className?: string;
}

/** Renders a single cross-link to another game node, or raw [target] if not a route (e.g. email_01_identity). */
export function CrossLink({
  gameNumber,
  target,
  label,
  config,
  className = "",
}: CrossLinkProps) {
  const href = gameNodeHref(gameNumber, target);
  const text = label ?? defaultRouteLabel(target, config);
  if (href == null || text == null) {
    return <span className={`font-mono text-sm text-muted-foreground ${className}`}>[{target}]</span>;
  }
  return (
    <Link
      href={href}
      className={`font-mono text-sm text-primary hover:underline ${className}`}
    >
      {text}
    </Link>
  );
}
