"use client";

import type { Game } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";

interface GameDistributionChartProps {
  distribution: Record<Game, number>;
  width?: number;
  height?: number;
}

export function GameDistributionChart({
  distribution,
  width = 400,
  height = 200,
}: GameDistributionChartProps) {
  const games = Object.entries(distribution) as [Game, number][];
  const sortedGames = games.sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Game Distribution</h3>
      
      <div className="space-y-2">
        {sortedGames.map(([game, percentage]) => (
          <div key={game} className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: GAME_COLORS[game] }}
                />
                <span className="font-mono text-foreground">{game}</span>
              </div>
              <span className="font-mono text-muted-foreground">{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: GAME_COLORS[game],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
