"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Podcast, PodcastMetrics } from "@/lib/types/metaspn";

interface PodcastCardProps {
  podcast: Podcast;
  metrics: PodcastMetrics;
}

// Deterministic "random" number generator based on seed
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function PodcastCard({ podcast, metrics }: PodcastCardProps) {
  // Generate deterministic sparkline data based on podcast ID
  const experienceScores = useMemo(() => {
    // Create a simple hash from podcast ID
    let hash = 0;
    for (let i = 0; i < podcast.id.length; i++) {
      hash = ((hash << 5) - hash) + podcast.id.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Array.from({ length: 10 }, (_, i) => {
      const seed = hash + i;
      const random = seededRandom(seed);
      return 60 + random * 30 + (i * 2); // Mock trend
    });
  }, [podcast.id]);

  return (
    <Link href={`/podcast/${podcast.id}`}>
      <div className="question-card lift-on-hover cursor-pointer">
        <div className="flex gap-4">
          {podcast.image_url ? (
            <Image
              src={podcast.image_url}
              alt={podcast.title}
              width={120}
              height={120}
              className="rounded object-cover"
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-muted rounded flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {podcast.title.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {podcast.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono border border-primary/30">
                {metrics.dominant_game}
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-mono border border-border">
                {metrics.experience_type}
              </span>
            </div>
            
            {/* Mini sparkline */}
            <div className="mb-3">
              <div className="h-8 flex items-end gap-0.5">
                {experienceScores.map((score, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/30"
                    style={{
                      height: `${(score / 100) * 100}%`,
                      minHeight: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 text-sm text-muted-foreground font-mono">
              <span>Dominant: {Math.round(metrics.game_distribution[metrics.dominant_game])}%</span>
              <span>Margin: {metrics.margin_mean.toFixed(2)}</span>
              <span>Phases: {metrics.phase_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
