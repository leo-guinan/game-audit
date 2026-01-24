"use client";

import type { Game } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";

interface RadarChartProps {
  distribution: Record<Game, number>;
  width?: number;
  height?: number;
}

const GAMES: Game[] = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

export function RadarChart({
  distribution,
  width = 400,
  height = 400,
}: RadarChartProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  const maxValue = 100; // percentages

  // Calculate angle for each game (6 games, evenly spaced)
  const angleStep = (2 * Math.PI) / GAMES.length;

  // Calculate points for the polygon
  const points = GAMES.map((game, index) => {
    const angle = (index * angleStep) - (Math.PI / 2); // Start at top
    const value = distribution[game] || 0;
    const distance = (value / maxValue) * radius;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    return { x, y, game, value, angle };
  });

  // Create polygon path
  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid circles (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Game Distribution</h3>
      
      <div className="relative border border-border bg-muted/20" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          <defs>
            <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          
          {/* Grid circles */}
          {gridLevels.map((level) => {
            const r = radius * level;
            return (
              <circle
                key={level}
                cx={centerX}
                cy={centerY}
                r={r}
                fill="none"
                stroke="var(--border)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}

          {/* Grid lines (axes) */}
          {GAMES.map((game, index) => {
            const angle = (index * angleStep) - (Math.PI / 2);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={game}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="var(--border)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}

          {/* Polygon fill */}
          <polygon
            points={polygonPath}
            fill="var(--primary)"
            fillOpacity="0.2"
            stroke="var(--primary)"
            strokeWidth="2"
          />

          {/* Data points and labels */}
          {points.map((point, index) => {
            const game = GAMES[index]!;
            const color = GAME_COLORS[game];
            
            return (
              <g key={game}>
                {/* Point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill={color}
                  stroke="var(--bg)"
                  strokeWidth="2"
                />
                
                {/* Label */}
                <text
                  x={point.x + (point.x > centerX ? 8 : -8)}
                  y={point.y + (point.y > centerY ? 12 : -4)}
                  textAnchor={point.x > centerX ? 'start' : 'end'}
                  fill={color}
                  fontSize="12"
                  fontFamily="var(--mono)"
                  fontWeight="600"
                >
                  {game}
                </text>
                
                {/* Value */}
                <text
                  x={point.x + (point.x > centerX ? 8 : -8)}
                  y={point.y + (point.y > centerY ? 24 : -16)}
                  textAnchor={point.x > centerX ? 'start' : 'end'}
                  fill="var(--muted-foreground)"
                  fontSize="10"
                  fontFamily="var(--mono)"
                >
                  {point.value.toFixed(1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
        {GAMES.map((game) => (
          <div key={game} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: GAME_COLORS[game] }}
            />
            <span>{game}: {distribution[game]?.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
