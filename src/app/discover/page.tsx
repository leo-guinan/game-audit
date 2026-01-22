"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { PodcastCard } from "@/components/metaspn/podcast-card";
import type { Game } from "@/lib/types/metaspn";
import type { PodcastMetrics, Podcast } from "@/lib/types/metaspn";
import Link from "next/link";

const GAMES: Game[] = ["G1", "G2", "G3", "G4", "G5", "G6"];

type DiscoverEpisode = { episode: { id: string; title: string; podcast_id: string }; geometry: { margin: number; boundary_flag: boolean; primary_game: string; secondary_game?: string }; podcast: { title: string } };

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"podcasts" | "games" | "boundary">("podcasts");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [filterGame, setFilterGame] = useState<Game | "all">("all");
  const [filterExperience, setFilterExperience] = useState<"all" | "Convergent" | "Boundary">("all");
  const [sortBy, setSortBy] = useState<"experience" | "margin" | "convergent">("experience");

  const [podcasts, setPodcasts] = useState<Array<{ podcast: Podcast; metrics: PodcastMetrics }>>([]);
  const [episodesByGame, setEpisodesByGame] = useState<DiscoverEpisode[]>([]);
  const [boundaryEpisodes, setBoundaryEpisodes] = useState<DiscoverEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingBoundary, setLoadingBoundary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError(null);
    fetch("/api/metaspn/podcasts")
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        if (d.error) {
          setError(d.error);
          setPodcasts([]);
        } else {
          setPodcasts(d.podcasts ?? []);
        }
      })
      .catch((e) => {
        if (!ok) return;
        setError(String(e.message));
        setPodcasts([]);
      })
      .finally(() => {
        if (ok) setLoading(false);
      });
    return () => {
      ok = false;
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "games" || !selectedGame) {
      setEpisodesByGame([]);
      return;
    }
    let ok = true;
    setLoadingGames(true);
    fetch(`/api/metaspn/episodes?game=${selectedGame}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        setEpisodesByGame(d.episodes ?? []);
      })
      .catch(() => {
        if (!ok) return;
        setEpisodesByGame([]);
      })
      .finally(() => {
        if (ok) setLoadingGames(false);
      });
    return () => {
      ok = false;
    };
  }, [activeTab, selectedGame]);

  useEffect(() => {
    if (activeTab !== "boundary") {
      setBoundaryEpisodes([]);
      return;
    }
    let ok = true;
    setLoadingBoundary(true);
    fetch("/api/metaspn/episodes?boundary=1")
      .then((r) => r.json())
      .then((d) => {
        if (!ok) return;
        setBoundaryEpisodes(d.episodes ?? []);
      })
      .catch(() => {
        if (!ok) return;
        setBoundaryEpisodes([]);
      })
      .finally(() => {
        if (ok) setLoadingBoundary(false);
      });
    return () => {
      ok = false;
    };
  }, [activeTab]);

  let filteredPodcasts = podcasts;
  if (filterGame !== "all") {
    filteredPodcasts = filteredPodcasts.filter((p) => p.metrics.dominant_game === filterGame);
  }
  if (filterExperience !== "all") {
    filteredPodcasts = filteredPodcasts.filter((p) => p.metrics.experience_type === filterExperience);
  }
  filteredPodcasts = [...filteredPodcasts].sort((a, b) => {
    switch (sortBy) {
      case "experience":
        return b.metrics.experience_score_final - a.metrics.experience_score_final;
      case "margin":
        return b.metrics.margin_mean - a.metrics.margin_mean;
      case "convergent":
        if (a.metrics.experience_type === "Convergent" && b.metrics.experience_type !== "Convergent") return -1;
        if (a.metrics.experience_type !== "Convergent" && b.metrics.experience_type === "Convergent") return 1;
        return b.metrics.experience_score_final - a.metrics.experience_score_final;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto max-w-7xl px-6 sm:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Podcasts</h1>
          <p className="text-lg text-muted-foreground">
            Browse podcasts by thinking style, not just category
          </p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("podcasts")}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
              activeTab === "podcasts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Podcasts
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
              activeTab === "games" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Games Index
          </button>
          <button
            onClick={() => setActiveTab("boundary")}
            className={`px-4 py-2 font-mono text-sm border-b-2 transition-colors ${
              activeTab === "boundary" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Boundary Episodes
          </button>
        </div>

        {activeTab === "podcasts" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 p-4 bg-muted/20 border border-border">
              <div className="flex items-center gap-2">
                <label className="text-sm font-mono text-muted-foreground">Game:</label>
                <select
                  value={filterGame}
                  onChange={(e) => setFilterGame(e.target.value as Game | "all")}
                  className="px-3 py-1 bg-background border border-border text-foreground text-sm font-mono"
                >
                  <option value="all">All</option>
                  {GAMES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-mono text-muted-foreground">Experience:</label>
                <select
                  value={filterExperience}
                  onChange={(e) => setFilterExperience(e.target.value as typeof filterExperience)}
                  className="px-3 py-1 bg-background border border-border text-foreground text-sm font-mono"
                >
                  <option value="all">All</option>
                  <option value="Convergent">Convergent</option>
                  <option value="Boundary">Boundary</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-mono text-muted-foreground">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-1 bg-background border border-border text-foreground text-sm font-mono"
                >
                  <option value="experience">Highest Experience</option>
                  <option value="margin">Highest Margin</option>
                  <option value="convergent">Most Convergent</option>
                </select>
              </div>
            </div>

            {error && <p className="text-destructive font-mono text-sm">{error}</p>}
            {loading && <p className="text-muted-foreground">Loading…</p>}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredPodcasts.map(({ podcast, metrics }) => (
                  <PodcastCard key={podcast.id} podcast={podcast} metrics={metrics} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "games" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {GAMES.map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(selectedGame === game ? null : game)}
                  className={`p-6 border-2 transition-all ${
                    selectedGame === game ? "border-primary bg-primary/10" : "border-border bg-muted/20 hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl font-bold font-mono text-foreground mb-2">{game}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedGame === game ? "View episodes below" : "Select to view episodes"}
                  </div>
                </button>
              ))}
            </div>

            {selectedGame && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Episodes in {selectedGame}
                </h2>
                {loadingGames && <p className="text-muted-foreground">Loading…</p>}
                {!loadingGames && (
                  <div className="space-y-2">
                    {episodesByGame.slice(0, 50).map(({ episode, geometry, podcast }) => (
                      <Link
                        key={episode.id}
                        href={`/episode/${encodeURIComponent(episode.id)}`}
                        className="block p-4 border border-border bg-muted/20 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-foreground">{episode.title}</div>
                            <div className="text-sm text-muted-foreground">{podcast.title}</div>
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            Margin: {geometry.margin.toFixed(2)}
                            {geometry.boundary_flag && " • Boundary"}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "boundary" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 border border-border">
              <p className="text-sm text-muted-foreground">
                Boundary episodes are conversations that exist between games—ambiguous, exploratory, and often the most interesting.
              </p>
            </div>
            {loadingBoundary && <p className="text-muted-foreground">Loading…</p>}
            {!loadingBoundary && (
              <div className="space-y-2">
                {boundaryEpisodes.slice(0, 50).map(({ episode, geometry, podcast }) => (
                  <Link
                    key={episode.id}
                    href={`/episode/${encodeURIComponent(episode.id)}`}
                    className="block p-4 border border-border bg-muted/20 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground">{episode.title}</div>
                        <div className="text-sm text-muted-foreground">{podcast.title}</div>
                        <div className="text-xs font-mono text-muted-foreground mt-1">
                          {geometry.primary_game} ↔ {geometry.secondary_game ?? "?"}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground">
                        Margin: {geometry.margin.toFixed(2)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
