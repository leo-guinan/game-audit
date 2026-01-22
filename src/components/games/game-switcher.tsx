"use client";

import Link from "next/link";
import type { GameConfig } from "@/lib/games/types";

interface GameSwitcherProps {
  currentGameNumber: number;
  games: Array<{ gameNumber: number; config: GameConfig }>;
  className?: string;
}

export function GameSwitcher({
  currentGameNumber,
  games,
  className = "",
}: GameSwitcherProps) {
  return (
    <nav
      className={`border border-border bg-muted/30 p-4 ${className}`}
      aria-label="Switch game"
    >
      <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Choose your game
      </div>
      <div className="flex flex-wrap gap-2">
        {games.map(({ gameNumber, config }) => {
          const isActive = gameNumber === currentGameNumber;
          const href = `/games/${gameNumber}`;
          return (
            <Link
              key={gameNumber}
              href={href}
              className={`
                inline-block px-3 py-1.5 font-mono text-sm border transition-colors
                ${isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }
              `}
              aria-current={isActive ? "true" : undefined}
            >
              {config.game_number}. {config.game_name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
