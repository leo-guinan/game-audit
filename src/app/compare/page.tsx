"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { GameDistributionChart } from "@/components/metaspn/game-distribution-chart";
import Link from "next/link";
import type { Game } from "@/lib/types/metaspn";
import type { CompareResponse } from "@/lib/types/metaspn";
import type { Podcast, PodcastMetrics } from "@/lib/types/metaspn";

const GAMES: Game[] = ["G1", "G2", "G3", "G4", "G5", "G6"];

export default function ComparePage() {
  const [podcast1Id, setPodcast1Id] = useState<string>("");
  const [podcast2Id, setPodcast2Id] = useState<string>("");
  const [allPodcasts, setAllPodcasts] = useState<Array<{ podcast: Podcast; metrics: PodcastMetrics }>>([]);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);

  useEffect(() => {
    fetch("/api/metaspn/podcasts")
      .then((r) => r.json())
      .then((d) => {
        setAllPodcasts(d.podcasts ?? []);
      })
      .catch(() => setAllPodcasts([]))
      .finally(() => setLoadingPodcasts(false));
  }, []);

  useEffect(() => {
    if (!podcast1Id || !podcast2Id) {
      setComparison(null);
      return;
    }
    let ok = true;
    setLoadingCompare(true);
    setComparison(null);
    fetch(`/api/metaspn/compare?podcast1=${encodeURIComponent(podcast1Id)}&podcast2=${encodeURIComponent(podcast2Id)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        if (d.error) setComparison(null);
        else setComparison(d);
      })
      .catch(() => {
        if (!ok) return;
        setComparison(null);
      })
      .finally(() => {
        if (ok) setLoadingCompare(false);
      });
    return () => { ok = false; };
  }, [podcast1Id, podcast2Id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Compare Podcasts</h1>
          <p className="text-lg text-muted-foreground">
            Compare two shows by geometry, not just audience size
          </p>
        </div>

        {/* Podcast Selection */}
        <div className="question-card mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Select Podcasts to Compare</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Podcast 1
              </label>
              <select
                value={podcast1Id}
                onChange={(e) => setPodcast1Id(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border text-foreground"
              >
                <option value="">Select a podcast...</option>
                {loadingPodcasts ? (
                  <option value="">Loading…</option>
                ) : (
                  allPodcasts.map(({ podcast }) => (
                    <option key={podcast.id} value={podcast.id}>
                      {podcast.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono text-muted-foreground mb-2">
                Podcast 2
              </label>
              <select
                value={podcast2Id}
                onChange={(e) => setPodcast2Id(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border text-foreground"
              >
                <option value="">Select a podcast...</option>
                {loadingPodcasts ? (
                  <option value="">Loading…</option>
                ) : (
                  allPodcasts
                    .filter(({ podcast }) => podcast.id !== podcast1Id)
                    .map(({ podcast }) => (
                      <option key={podcast.id} value={podcast.id}>
                        {podcast.title}
                      </option>
                    ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="space-y-8">
            {/* Headline Metrics */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Headline Metrics</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {comparison.podcast1.podcast.title}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Dominant Game</div>
                      <div className="text-xl font-bold font-mono text-primary">
                        {comparison.podcast1.metrics.dominant_game}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Experience Type</div>
                      <div className="text-lg font-semibold text-foreground">
                        {comparison.podcast1.metrics.experience_type}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Avg Margin</div>
                      <div className="text-lg font-semibold text-foreground">
                        {comparison.podcast1.metrics.margin_mean.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Phase Count</div>
                      <div className="text-lg font-semibold text-foreground">
                        {comparison.podcast1.metrics.phase_count}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {comparison.podcast2.podcast.title}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Dominant Game</div>
                      <div className="text-xl font-bold font-mono text-primary">
                        {comparison.podcast2.metrics.dominant_game}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Experience Type</div>
                      <div className="text-lg font-semibold text-foreground">
                        {comparison.podcast2.metrics.experience_type}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Avg Margin</div>
                      <div className="text-lg font-semibold text-foreground">
                        {comparison.podcast2.metrics.margin_mean.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-mono text-muted-foreground">Phase Count</div>
                      <div className="text-lg font-semibold text-foreground">
                        {comparison.podcast2.metrics.phase_count}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Distribution Comparison */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-6">Game Distribution</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {comparison.podcast1.podcast.title}
                  </h3>
                  <GameDistributionChart distribution={comparison.podcast1.metrics.game_distribution} />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {comparison.podcast2.podcast.title}
                  </h3>
                  <GameDistributionChart distribution={comparison.podcast2.metrics.game_distribution} />
                </div>
              </div>
            </div>

            {/* Game Overlap */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Game Overlap</h2>
              
              <div className="space-y-3">
                {GAMES.map(game => {
                  const pod1Pct = comparison.comparison.game_overlap[game].podcast1;
                  const pod2Pct = comparison.comparison.game_overlap[game].podcast2;
                  
                  return (
                    <div key={game} className="space-y-2">
                      <div className="flex justify-between text-sm font-mono">
                        <span className="text-foreground">{game}</span>
                        <div className="flex gap-4 text-muted-foreground">
                          <span>Podcast 1: {pod1Pct.toFixed(1)}%</span>
                          <span>Podcast 2: {pod2Pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 h-4">
                        <div
                          className="bg-primary/50"
                          style={{ width: `${pod1Pct}%` }}
                        />
                        <div
                          className="bg-primary/30"
                          style={{ width: `${pod2Pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comparison Stats */}
            <div className="question-card">
              <h2 className="text-2xl font-bold text-foreground mb-4">Comparison Metrics</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">
                    Experience Trajectory Difference
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {comparison.comparison.experience_trajectory_diff.toFixed(1)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">
                    Margin Distribution Difference
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {comparison.comparison.margin_distribution_diff.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-mono text-muted-foreground mb-2">
                    Same Dominant Game?
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {comparison.podcast1.metrics.dominant_game === comparison.podcast2.metrics.dominant_game
                      ? 'Yes'
                      : 'No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href={`/podcast/${comparison.podcast1.podcast.id}`}
                className="button"
              >
                View {comparison.podcast1.podcast.title}
              </Link>
              <Link
                href={`/podcast/${comparison.podcast2.podcast.id}`}
                className="button secondary"
              >
                View {comparison.podcast2.podcast.title}
              </Link>
            </div>
          </div>
        )}

        {loadingCompare && podcast1Id && podcast2Id && (
          <div className="question-card">
            <p className="text-muted-foreground">Loading comparison…</p>
          </div>
        )}
      </main>
    </div>
  );
}
