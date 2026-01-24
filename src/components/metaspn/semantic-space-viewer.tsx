"use client";

import { useState } from "react";
import type { EpisodeGeometry, PodcastManifolds, Game } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";

export function SemanticSpaceViewer({
  episodes,
  centroids,
  onEpisodeClick,
  width = 600,
  height = 600,
}: SemanticSpaceViewerProps) {
  const [showBoundaryOnly, setShowBoundaryOnly] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [showCentroids, setShowCentroids] = useState(true);
  const [hoveredEpisode, setHoveredEpisode] = useState<string | null>(null);

  // Calculate bounds
  const allX = [...episodes.map(e => e.pca.pc1), ...Object.values(centroids).map(c => c?.centroid?.pc1 || 0)];
  const allY = [...episodes.map(e => e.pca.pc2), ...Object.values(centroids).map(c => c?.centroid?.pc2 || 0)];
  
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  
  const padding = 0.5;
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  
  const scaleX = (x: number) => ((x - minX) / rangeX) * (width - 40) + 20;
  const scaleY = (y: number) => ((y - minY) / rangeY) * (height - 40) + 20;

  const filteredEpisodes = showBoundaryOnly
    ? episodes.filter(e => e.boundary_flag)
    : episodes;

  // Sort episodes by index for trajectory
  const sortedEpisodes = [...filteredEpisodes].sort((a, b) => {
    const idxA = episodes.findIndex(e => e.episode_id === a.episode_id);
    const idxB = episodes.findIndex(e => e.episode_id === b.episode_id);
    return idxA - idxB;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBoundaryOnly}
            onChange={(e) => setShowBoundaryOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-mono text-muted-foreground">Boundary only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTrajectory}
            onChange={(e) => setShowTrajectory(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-mono text-muted-foreground">Trajectory</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCentroids}
            onChange={(e) => setShowCentroids(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-mono text-muted-foreground">Centroids</span>
        </label>
      </div>

      <div className="relative border border-border bg-muted/20" style={{ width, height }}>
        <svg width={width} height={height} className="absolute inset-0">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Trajectory line */}
          {showTrajectory && sortedEpisodes.length > 1 && (
            <polyline
              points={sortedEpisodes.map(e => `${scaleX(e.pca.pc1)},${scaleY(e.pca.pc2)}`).join(' ')}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.4"
            />
          )}
          
          {/* Episode points */}
          {filteredEpisodes.map((episode) => {
            const x = scaleX(episode.pca.pc1);
            const y = scaleY(episode.pca.pc2);
            const size = 4 + (episode.margin * 6); // Size based on margin
            const color = GAME_COLORS[episode.primary_game];
            const isHovered = hoveredEpisode === episode.episode_id;
            
            return (
              <g key={episode.episode_id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? size + 2 : size}
                  fill={color}
                  stroke={isHovered ? "var(--gold)" : "transparent"}
                  strokeWidth={2}
                  opacity={episode.boundary_flag ? 0.6 : 0.8}
                  className="cursor-pointer transition-all"
                  onClick={() => onEpisodeClick?.(episode.episode_id)}
                  onMouseEnter={() => setHoveredEpisode(episode.episode_id)}
                  onMouseLeave={() => setHoveredEpisode(null)}
                />
                {episode.boundary_flag && (
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 3}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity="0.5"
                  />
                )}
              </g>
            );
          })}
          
          {/* Centroids */}
          {showCentroids && Object.entries(centroids).map(([game, centroid]) => {
            if (!centroid?.centroid) return null;
            const x = scaleX(centroid.centroid.pc1);
            const y = scaleY(centroid.centroid.pc2);
            
            return (
              <g key={game}>
                <circle
                  cx={x}
                  cy={y}
                  r={8}
                  fill={GAME_COLORS[game as Game]}
                  stroke="var(--bg)"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="var(--bg)"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="var(--mono)"
                >
                  {game}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredEpisode && (() => {
          const episode = episodes.find(e => e.episode_id === hoveredEpisode);
          if (!episode) return null;
          
          return (
            <div
              className="absolute bg-card border border-border p-3 rounded shadow-lg z-10 pointer-events-none"
              style={{
                left: scaleX(episode.pca.pc1) + 20,
                top: scaleY(episode.pca.pc2) - 60,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="text-xs font-mono space-y-1">
                <div className="font-bold text-foreground">Episode {episode.episode_id.split('-').pop()}</div>
                <div className="text-muted-foreground">Game: {episode.primary_game}</div>
                <div className="text-muted-foreground">Margin: {episode.margin.toFixed(2)}</div>
              </div>
            </div>
          );
        })()}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono">
        {Object.entries(GAME_COLORS).map(([game, color]) => (
          <div key={game} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{game}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
