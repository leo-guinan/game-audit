"use client";

import { useState } from "react";
import Link from "next/link";
import type { Game, EpisodeGeometry, EpisodeExperience } from "@/lib/types/metaspn";
import { GAME_COLORS } from "@/lib/constants/game-colors";

interface EpisodeListItem {
  episode_id: string;
  geometry: EpisodeGeometry;
  experience?: EpisodeExperience;
  title?: string;
  episode_number?: number;
  is_guest_episode?: boolean;
  guest_names?: string[];
}

interface EpisodeListProps {
  episodes: EpisodeListItem[];
  podcastId: string;
  layout?: 'list' | 'grid';
  showFilters?: boolean;
  showSort?: boolean;
}

export function EpisodeList({
  episodes,
  podcastId,
  layout = 'list',
  showFilters = true,
  showSort = true,
}: EpisodeListProps) {
  const [selectedGame, setSelectedGame] = useState<Game | 'all'>('all');
  const [sortBy, setSortBy] = useState<'episode' | 'score' | 'margin'>('episode');
  const [showGuestOnly, setShowGuestOnly] = useState<boolean | null>(null);

  const GAMES: Game[] = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

  // Filter episodes
  const filtered = episodes.filter(ep => {
    if (selectedGame !== 'all' && ep.geometry.primary_game !== selectedGame) {
      return false;
    }
    if (showGuestOnly === true && !ep.is_guest_episode) {
      return false;
    }
    if (showGuestOnly === false && ep.is_guest_episode) {
      return false;
    }
    return true;
  });

  // Sort episodes
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'episode') {
      return (a.episode_number ?? 0) - (b.episode_number ?? 0);
    }
    if (sortBy === 'score') {
      const scoreA = a.experience?.experience_score ?? 0;
      const scoreB = b.experience?.experience_score ?? 0;
      return scoreB - scoreA;
    }
    if (sortBy === 'margin') {
      return b.geometry.margin - a.geometry.margin;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      {(showFilters || showSort) && (
        <div className="flex flex-wrap gap-4 items-center p-4 border border-border bg-muted/20">
          {showFilters && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono text-muted-foreground">Filter:</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value as Game | 'all')}
                  className="px-2 py-1 bg-background border border-border text-foreground text-xs font-mono"
                >
                  <option value="all">All Games</option>
                  {GAMES.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono text-muted-foreground">Type:</label>
                <select
                  value={showGuestOnly === null ? 'all' : showGuestOnly ? 'guest' : 'solo'}
                  onChange={(e) => {
                    if (e.target.value === 'all') setShowGuestOnly(null);
                    else setShowGuestOnly(e.target.value === 'guest');
                  }}
                  className="px-2 py-1 bg-background border border-border text-foreground text-xs font-mono"
                >
                  <option value="all">All</option>
                  <option value="solo">Solo</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
            </>
          )}
          
          {showSort && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-muted-foreground">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'episode' | 'score' | 'margin')}
                className="px-2 py-1 bg-background border border-border text-foreground text-xs font-mono"
              >
                <option value="episode">Episode #</option>
                <option value="score">Experience Score</option>
                <option value="margin">Margin</option>
              </select>
            </div>
          )}
          
          <div className="text-xs font-mono text-muted-foreground ml-auto">
            {sorted.length} episode{sorted.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Episode List/Grid */}
      {layout === 'list' ? (
        <div className="space-y-2">
          {sorted.map((episode, idx) => (
            <Link
              key={episode.episode_id}
              href={`/episode/${encodeURIComponent(episode.episode_id)}`}
              className="block question-card lift-on-hover"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="px-2 py-1 text-xs font-mono border"
                      style={{
                        backgroundColor: `${GAME_COLORS[episode.geometry.primary_game]}20`,
                        color: GAME_COLORS[episode.geometry.primary_game],
                        borderColor: `${GAME_COLORS[episode.geometry.primary_game]}50`,
                      }}
                    >
                      {episode.geometry.primary_game}
                    </span>
                    {episode.geometry.secondary_game && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-mono border border-border">
                        {episode.geometry.secondary_game}
                      </span>
                    )}
                    {episode.geometry.boundary_flag && (
                      <span className="px-2 py-1 bg-destructive/20 text-destructive text-xs font-mono border border-destructive/30">
                        Boundary
                      </span>
                    )}
                    {episode.is_guest_episode && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono border border-primary/30">
                        Guest
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-foreground mb-1">
                    {episode.title || `Episode ${episode.episode_number ?? idx + 1}`}
                  </div>
                  {episode.guest_names && episode.guest_names.length > 0 && (
                    <div className="text-sm text-muted-foreground mb-1">
                      with {episode.guest_names.join(', ')}
                    </div>
                  )}
                  {episode.experience && (
                    <div className="text-sm text-muted-foreground">
                      Experience: {episode.experience.experience_score.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="text-sm font-mono text-muted-foreground ml-4">
                  Margin: {episode.geometry.margin.toFixed(2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((episode, idx) => (
            <Link
              key={episode.episode_id}
              href={`/episode/${encodeURIComponent(episode.episode_id)}`}
              className="block question-card lift-on-hover"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-1 text-xs font-mono border"
                    style={{
                      backgroundColor: `${GAME_COLORS[episode.geometry.primary_game]}20`,
                      color: GAME_COLORS[episode.geometry.primary_game],
                      borderColor: `${GAME_COLORS[episode.geometry.primary_game]}50`,
                    }}
                  >
                    {episode.geometry.primary_game}
                  </span>
                  {episode.is_guest_episode && (
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono border border-primary/30">
                      Guest
                    </span>
                  )}
                </div>
                <div className="font-semibold text-foreground">
                  {episode.title || `Episode ${episode.episode_number ?? idx + 1}`}
                </div>
                {episode.experience && (
                  <div className="text-sm text-muted-foreground">
                    Score: {episode.experience.experience_score.toFixed(1)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
