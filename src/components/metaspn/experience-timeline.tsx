"use client";

import { useState } from "react";
import type { EpisodeExperience } from "@/lib/types/metaspn";

interface ExperienceTimelineProps {
  episodes: EpisodeExperience[];
  phaseBoundaries?: number[]; // Episode indices where phases change
  onEpisodeHover?: (episodeId: string | null) => void;
  width?: number;
  height?: number;
}

export function ExperienceTimeline({
  episodes,
  phaseBoundaries = [],
  onEpisodeHover,
  width = 800,
  height = 200,
}: ExperienceTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxScore = Math.max(...episodes.map(e => e.experience_score), 100);
  const minScore = Math.min(...episodes.map(e => e.experience_score), 0);
  const range = maxScore - minScore || 1;

  const scaleX = (index: number) => (index / (episodes.length - 1 || 1)) * (width - 40) + 20;
  const scaleY = (score: number) => height - 40 - ((score - minScore) / range) * (height - 40);

  // Calculate rolling average
  const windowSize = Math.max(5, Math.floor(episodes.length / 10));
  const rollingAverage = episodes.map((_, idx) => {
    const start = Math.max(0, idx - Math.floor(windowSize / 2));
    const end = Math.min(episodes.length, idx + Math.ceil(windowSize / 2));
    const slice = episodes.slice(start, end);
    return slice.reduce((sum, e) => sum + e.experience_score, 0) / slice.length;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Experience Score Over Time</h3>
      
      <div className="relative border border-border bg-muted/20" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          {/* Grid lines */}
          <defs>
            <pattern id="timeline-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#timeline-grid)" />
          
          {/* Y-axis labels */}
          {[0, 25, 50, 75, 100].map(score => {
            const y = scaleY(score);
            return (
              <g key={score}>
                <line
                  x1={20}
                  y1={y}
                  x2={width - 20}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  opacity="0.3"
                />
                <text
                  x={15}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  fontSize="10"
                  fontFamily="var(--mono)"
                >
                  {score}
                </text>
              </g>
            );
          })}
          
          {/* Phase boundaries */}
          {phaseBoundaries.map((boundary, idx) => {
            const x = scaleX(boundary);
            return (
              <line
                key={idx}
                x1={x}
                y1={20}
                x2={x}
                y2={height - 20}
                stroke="var(--gold)"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            );
          })}
          
          {/* Rolling average line */}
          <polyline
            points={rollingAverage.map((avg, idx) => `${scaleX(idx)},${scaleY(avg)}`).join(' ')}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            opacity="0.6"
          />
          
          {/* Experience score line */}
          <polyline
            points={episodes.map((ep, idx) => `${scaleX(idx)},${scaleY(ep.experience_score)}`).join(' ')}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {episodes.map((episode, idx) => {
            const x = scaleX(idx);
            const y = scaleY(episode.experience_score);
            const isHovered = hoveredIndex === idx;
            
            return (
              <circle
                key={episode.episode_id}
                cx={x}
                cy={y}
                r={isHovered ? 5 : 3}
                fill="var(--primary)"
                stroke={isHovered ? "var(--gold)" : "transparent"}
                strokeWidth={2}
                className="cursor-pointer transition-all"
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  onEpisodeHover?.(episode.episode_id);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  onEpisodeHover?.(null);
                }}
              />
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute bg-card border border-border p-3 rounded shadow-lg z-10 pointer-events-none"
            style={{
              left: scaleX(hoveredIndex) + 20,
              top: scaleY(episodes[hoveredIndex].experience_score) - 60,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-xs font-mono space-y-1">
              <div className="font-bold text-foreground">Episode {hoveredIndex + 1}</div>
              <div className="text-muted-foreground">
                Score: {episodes[hoveredIndex].experience_score.toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary" />
          <span>Experience Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary opacity-60" style={{ borderStyle: 'dashed' }} />
          <span>Rolling Average</span>
        </div>
        {phaseBoundaries.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary opacity-50" style={{ borderStyle: 'dashed' }} />
            <span>Phase Boundaries</span>
          </div>
        )}
      </div>
    </div>
  );
}
