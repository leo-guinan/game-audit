"use client";

import { useState } from "react";
import type { EpisodeWithType } from "@/lib/types/metaspn";

interface TrajectoryChartProps {
  episodes: EpisodeWithType[];
  metric: 'entropy' | 'drift' | 'experience_score';
  title: string;
  yAxisLabel?: string;
  onEpisodeHover?: (episodeId: string | null) => void;
  width?: number;
  height?: number;
}

export function TrajectoryChart({
  episodes,
  metric,
  title,
  yAxisLabel,
  onEpisodeHover,
  width = 800,
  height = 200,
}: TrajectoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Extract values based on metric
  const values = episodes.map(ep => {
    if (metric === 'entropy') return ep.entropy ?? 0;
    if (metric === 'drift') return ep.drift ?? 0;
    return ep.experience_score;
  });

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  const scaleX = (index: number) => (index / (episodes.length - 1 || 1)) * (width - 60) + 40;
  const scaleY = (value: number) => height - 40 - ((value - minValue) / range) * (height - 80);

  // Calculate rolling average
  const windowSize = Math.max(5, Math.floor(episodes.length / 10));
  const rollingAverage = episodes.map((_, idx) => {
    const start = Math.max(0, idx - Math.floor(windowSize / 2));
    const end = Math.min(episodes.length, idx + Math.ceil(windowSize / 2));
    const slice = values.slice(start, end);
    return slice.reduce((sum, v) => sum + v, 0) / slice.length;
  });

  // Y-axis tick values
  const yTicks = 5;
  const tickStep = range / (yTicks - 1);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      
      <div className="relative border border-border bg-muted/20" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          <defs>
            <pattern id="trajectory-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trajectory-grid)" />
          
          {/* Y-axis labels and grid lines */}
          {Array.from({ length: yTicks }, (_, i) => {
            const value = minValue + (i * tickStep);
            const y = scaleY(value);
            return (
              <g key={i}>
                <line
                  x1={40}
                  y1={y}
                  x2={width - 20}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  opacity="0.3"
                />
                <text
                  x={35}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  fontSize="10"
                  fontFamily="var(--mono)"
                >
                  {value.toFixed(metric === 'experience_score' ? 0 : 2)}
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels */}
          {episodes.length > 0 && (
            <>
              <text
                x={40}
                y={height - 10}
                textAnchor="start"
                fill="var(--muted-foreground)"
                fontSize="10"
                fontFamily="var(--mono)"
              >
                Episode 1
              </text>
              <text
                x={width - 20}
                y={height - 10}
                textAnchor="end"
                fill="var(--muted-foreground)"
                fontSize="10"
                fontFamily="var(--mono)"
              >
                Episode {episodes.length}
              </text>
            </>
          )}
          
          {/* Rolling average line */}
          <polyline
            points={rollingAverage.map((avg, idx) => `${scaleX(idx)},${scaleY(avg)}`).join(' ')}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            opacity="0.6"
            strokeDasharray="4,4"
          />
          
          {/* Main trajectory line */}
          <polyline
            points={values.map((val, idx) => `${scaleX(idx)},${scaleY(val)}`).join(' ')}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          
          {/* Data points - differentiate solo vs guest */}
          {episodes.map((episode, idx) => {
            const x = scaleX(idx);
            const y = scaleY(values[idx]!);
            const isHovered = hoveredIndex === idx;
            const isGuest = episode.is_guest_episode;
            
            return (
              <g key={episode.episode_id}>
                {/* Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : (isGuest ? 4 : 3)}
                  fill={isGuest ? "var(--primary)" : "var(--muted-foreground)"}
                  stroke={isHovered ? "var(--primary)" : "var(--bg)"}
                  strokeWidth={isHovered ? 2 : 1}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => {
                    setHoveredIndex(idx);
                    onEpisodeHover?.(episode.episode_id);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    onEpisodeHover?.(null);
                  }}
                  opacity={isGuest ? 1 : 0.7}
                />
                
                {/* Guest indicator (hollow circle for guest episodes) */}
                {isGuest && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 8 : 6}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-card border border-border p-3 rounded shadow-lg z-10 pointer-events-none"
            style={{
              left: scaleX(hoveredIndex) + 20,
              top: scaleY(values[hoveredIndex]!) - 60,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-xs font-mono space-y-1">
              <div className="font-bold text-foreground">
                Episode {hoveredIndex + 1}
                {episodes[hoveredIndex]?.is_guest_episode && (
                  <span className="text-primary ml-2">(Guest)</span>
                )}
              </div>
              <div className="text-muted-foreground">
                {yAxisLabel || metric}: {values[hoveredIndex]!.toFixed(metric === 'experience_score' ? 1 : 2)}
              </div>
              {episodes[hoveredIndex]?.guest_names && (
                <div className="text-muted-foreground text-[10px]">
                  Guests: {episodes[hoveredIndex]!.guest_names!.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary opacity-60" style={{ borderStyle: 'dashed' }} />
          <span>Rolling Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-primary bg-primary/20" />
          <span>Guest Episodes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground opacity-70" />
          <span>Solo Episodes</span>
        </div>
      </div>
    </div>
  );
}
