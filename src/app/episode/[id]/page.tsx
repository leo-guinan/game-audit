"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/header";
import Link from "next/link";
import type { Game } from "@/lib/types/metaspn";
import type { EpisodePageResponse } from "@/lib/types/metaspn";

const GAME_COLORS: Record<Game, string> = {
  G1: '#c41e3a',
  G2: '#d4af37',
  G3: '#4a90e2',
  G4: '#9d7cd8',
  G5: '#50c878',
  G6: '#f4a460',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EpisodePage({ params }: PageProps) {
  const { id } = use(params);
  const [data, setData] = useState<EpisodePageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError(null);
    fetch(`/api/metaspn/episode/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        if (d.error) {
          setError(d.error);
          setData(null);
        } else {
          setData({
            episode: d.episode,
            classification: d.classification,
            geometry: d.geometry,
            experience: d.experience,
            segments: d.segments ?? [],
            evidence: d.evidence ?? [],
          });
        }
      })
      .catch((e) => {
        if (!ok) return;
        setError(String(e.message));
        setData(null);
      })
      .finally(() => {
        if (ok) setLoading(false);
      });
    return () => { ok = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <p className="text-muted-foreground">{error ?? "Episode not found"}</p>
        </div>
      </div>
    );
  }

  const { episode, classification, geometry, experience, segments, evidence } = data;

  // Format timestamp
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/discover" className="text-sm font-mono text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Back to Discover
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">{episode.title}</h1>
          {episode.episode_number && (
            <p className="text-lg text-muted-foreground">Episode {episode.episode_number}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Episode Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Episode Overview Card */}
            <div className="question-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Episode Overview</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Primary Game</div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-2 text-lg font-bold font-mono text-foreground border-2"
                      style={{
                        borderColor: GAME_COLORS[classification.game_top1],
                        backgroundColor: `${GAME_COLORS[classification.game_top1]}20`,
                      }}
                    >
                      {classification.game_top1}
                    </span>
                    {classification.game_top2 && (
                      <>
                        <span className="text-muted-foreground">→</span>
                        <span
                          className="px-3 py-2 text-lg font-bold font-mono text-foreground border-2"
                          style={{
                            borderColor: GAME_COLORS[classification.game_top2],
                            backgroundColor: `${GAME_COLORS[classification.game_top2]}20`,
                          }}
                        >
                          {classification.game_top2}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Margin</div>
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary transition-all"
                      style={{ width: `${geometry.margin * 100}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">
                    {geometry.margin.toFixed(2)} {geometry.margin < 0.4 ? '(Boundary)' : geometry.margin > 0.6 ? '(Pure)' : '(Mixed)'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Experience Score</div>
                  <div className="text-3xl font-bold text-foreground">
                    {experience.experience_score.toFixed(1)}/100
                  </div>
                </div>

                {geometry.boundary_flag && (
                  <div className="p-4 bg-destructive/10 border border-destructive/30 rounded">
                    <div className="text-sm font-mono text-destructive mb-1">Boundary Episode</div>
                    <p className="text-sm text-muted-foreground">
                      This is a low-margin boundary episode between {geometry.primary_game} and {geometry.secondary_game || 'another game'}.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Episode Geometry Panel */}
            <div className="question-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Geometry</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">Distances to Game Manifolds</div>
                  <div className="space-y-2">
                    {Object.entries(geometry.distances_to_manifolds)
                      .sort((a, b) => a[1] - b[1])
                      .map(([game, distance]) => (
                        <div key={game} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: GAME_COLORS[game as Game] }}
                            />
                            <span className="text-sm font-mono text-foreground">{game}</span>
                          </div>
                          <span className="text-sm font-mono text-muted-foreground">
                            {distance.toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">PCA Position</div>
                  <div className="text-sm font-mono text-foreground">
                    PC1: {geometry.pca.pc1.toFixed(2)}, PC2: {geometry.pca.pc2.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Boundary Moments Panel */}
            {evidence.length > 0 && (
              <div className="question-card">
                <h2 className="text-xl font-bold text-foreground mb-4">Boundary Moments</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Moments where the conversation shifts between games
                </p>
                
                <div className="space-y-4">
                  {evidence.map(ev => {
                    const segment = segments.find(s => s.id === ev.segment_id);
                    return (
                      <div key={ev.id} className="p-4 border border-border bg-muted/20 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-mono text-muted-foreground">
                            {formatTime(ev.timestamp)}
                          </div>
                          {ev.game && (
                            <span
                              className="px-2 py-1 text-xs font-mono border"
                              style={{
                                borderColor: GAME_COLORS[ev.game],
                                backgroundColor: `${GAME_COLORS[ev.game]}20`,
                                color: GAME_COLORS[ev.game],
                              }}
                            >
                              {ev.game}
                            </span>
                          )}
                        </div>
                        <blockquote className="text-foreground italic border-l-2 border-primary pl-4">
                          {ev.quote}
                        </blockquote>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Segment Timeline */}
            <div className="question-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Episode Timeline</h2>
              
              <div className="space-y-2">
                {segments.map(segment => (
                  <div
                    key={segment.id}
                    className={`p-3 border rounded ${
                      segment.boundary_flag
                        ? 'border-destructive/50 bg-destructive/10'
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-mono text-muted-foreground">
                        {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
                      </div>
                      {segment.game && (
                        <span
                          className="px-2 py-1 text-xs font-mono border"
                          style={{
                            borderColor: GAME_COLORS[segment.game],
                            backgroundColor: `${GAME_COLORS[segment.game]}20`,
                            color: GAME_COLORS[segment.game],
                          }}
                        >
                          {segment.game}
                        </span>
                      )}
                      {segment.boundary_flag && (
                        <span className="px-2 py-1 text-xs font-mono text-destructive border border-destructive/30 bg-destructive/10">
                          Boundary
                        </span>
                      )}
                    </div>
                    {segment.transcript && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {segment.transcript}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Semantic Space */}
            <div className="question-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Position in Semantic Space</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This episode's position relative to the show's semantic space
              </p>
              <div className="border border-border bg-muted/20 p-8 rounded">
                <div className="text-center space-y-2">
                  <div className="text-sm font-mono text-muted-foreground">PCA Coordinates</div>
                  <div className="text-2xl font-bold font-mono text-foreground">
                    ({geometry.pca.pc1.toFixed(2)}, {geometry.pca.pc2.toFixed(2)})
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    Full semantic space visualization available on podcast page
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
