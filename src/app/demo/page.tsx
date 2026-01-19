"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header";

type Episode = {
  id: string;
  title: string;
  game: string;
  nativeGames?: string[];
  premise?: string;
};

type Analysis = {
  alignment: number;
  failures: string[];
  genericSummary: string;
  gameAlignedSummary?: string;
  audienceEngagement: {
    aligned: number;
    misaligned1: number;
    misaligned2: number;
  };
};

const games = [
  {
    id: "G1",
    name: "Identity / Canon",
    description: "Shape who the listener becomes",
  },
  {
    id: "G2",
    name: "Plays / Tactics",
    description: "Extract actionable moves",
  },
  {
    id: "G3",
    name: "Models / Understanding",
    description: "Build transferable mental models",
  },
  {
    id: "G4",
    name: "Performance / Coaching",
    description: "Improve outcomes",
  },
  {
    id: "G5",
    name: "Meaning / Sensemaking",
    description: "Make sense of change and identity",
  },
  {
    id: "G6",
    name: "Network / Coordination",
    description: "Orchestrate people and connections",
  },
];

export default function DemoPage() {
  const [step, setStep] = useState(0);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [preloadingSummary, setPreloadingSummary] = useState(false);
  const [preloadedSummary, setPreloadedSummary] = useState<Analysis | null>(null);

  useEffect(() => {
    // Load episodes
    fetch("/api/demo/episodes")
      .then((res) => res.json())
      .then((data) => setEpisodes(data))
      .catch(console.error);
  }, []);

  // Optimistically preload generic summary when episode is selected
  useEffect(() => {
    if (selectedEpisode && !preloadedSummary && !preloadingSummary) {
      setPreloadingSummary(true);
      
      fetch("/api/demo/analyze/generic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: selectedEpisode.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setPreloadedSummary(data);
          setPreloadingSummary(false);
        })
        .catch((error) => {
          console.error("Preload error:", error);
          setPreloadingSummary(false);
        });
    }
  }, [selectedEpisode?.id, preloadedSummary, preloadingSummary]);

  const handleEpisodeSelect = (episode: Episode) => {
    // Just select the episode, don't auto-advance
    setSelectedEpisode(episode);
  };

  const handleContinueToBaseline = async () => {
    if (!selectedEpisode) return;
    
    // If we already have preloaded summary, use it immediately
    if (preloadedSummary) {
      setAnalysis(preloadedSummary);
      setStep(1);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setStep(1);
    
    try {
      const response = await fetch("/api/demo/analyze/generic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: selectedEpisode.id,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = async (gameId: string) => {
    if (!selectedEpisode) return;
    setSelectedGame(gameId);
    setLoading(true);

    try {
      const gameResponse = await fetch("/api/demo/analyze/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: selectedEpisode.id,
          selectedGame: gameId,
        }),
      });
      const gameData = await gameResponse.json();
      
      // Merge with existing analysis
      setAnalysis((prev) => ({
        alignment: gameData.alignment ?? prev?.alignment ?? 0,
        failures: Array.isArray(gameData.failures) ? gameData.failures : (prev?.failures || []),
        genericSummary: prev?.genericSummary || "",
        gameAlignedSummary: gameData.gameAlignedSummary,
        audienceEngagement: gameData.audienceEngagement || prev?.audienceEngagement || { aligned: 0, misaligned1: 0, misaligned2: 0 },
      }));

      // Navigate to step 3 (game-aligned rewrite) after we have the data
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGameFitIndicator = (gameId: string): "high" | "medium" | "low" => {
    // On Screen 2, always use episode's native games (don't depend on selectedGame)
    // This gives consistent fit indicators before selection
    const episodeNativeGames = selectedEpisode?.nativeGames || [];
    return episodeNativeGames.includes(gameId) ? "high" : "medium";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 sm:text-5xl">
            The Interactive Alignment Simulator
          </h1>
          <p className="text-xl text-muted-foreground">
            Same content. Different games. Different outcomes.
          </p>
        </div>

        {/* Screen 0: Episode Selection */}
        {step === 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Choose an episode
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Pick a real episode so the baseline is grounded in reality.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeSelect(episode)}
                  className={`question-card text-left lift-on-hover ${
                    selectedEpisode?.id === episode.id
                      ? ""
                      : ""
                  }`}
                  style={selectedEpisode?.id === episode.id ? {
                    borderColor: 'var(--gold)',
                    background: 'rgba(212, 175, 55, 0.08)'
                  } : {}}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {episode.title}
                  </h3>
                  {episode.premise && (
                    <p className="text-sm text-muted-foreground">
                      {episode.premise}
                    </p>
                  )}
                </button>
              ))}
            </div>
            {selectedEpisode && (
              <div className="text-center pt-6 border-t border-border">
                <button
                  onClick={handleContinueToBaseline}
                  disabled={loading}
                  className="button"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Screen 1: Baseline Reality - Generic Summary */}
        {step === 1 && selectedEpisode && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Here's what happens when you don't specify a game
              </h2>
            </div>
            <div className="question-card">
              {loading ? (
                <div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : (
                <div className="space-y-4 text-lg leading-8 text-foreground">
                  <p className="italic text-muted-foreground">
                    "{analysis?.genericSummary || "This episode discusses the importance of focus, long-term thinking, and disciplined execution as key drivers of sustained success."}"
                  </p>
                  <p className="text-sm text-muted-foreground pt-4 font-mono uppercase tracking-wider">
                    This is what AI produces by default.
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="button"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Screen 2: Game Fit Reveal */}
        {step === 2 && selectedEpisode && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Now watch what changes when we choose a game
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                This content isn't bad. It just belongs somewhere specific.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {games.map((game) => {
                const fit = getGameFitIndicator(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => handleGameSelect(game.id)}
                    disabled={loading}
                    className="question-card text-left lift-on-hover"
                    style={
                      fit === "high"
                        ? { borderColor: "var(--gold)", background: "rgba(212, 175, 55, 0.08)" }
                        : fit === "low"
                        ? { borderColor: "var(--red)", background: "rgba(196, 30, 58, 0.08)" }
                        : {}
                    }
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {game.id} — {game.name}
                      </h3>
                      {fit === "high" && (
                        <span className="font-semibold text-sm font-mono uppercase tracking-wider" style={{ color: "var(--gold)" }}>
                          ✓ High Fit
                        </span>
                      )}
                      {fit === "low" && (
                        <span className="font-semibold text-sm font-mono uppercase tracking-wider" style={{ color: "var(--red)" }}>
                          ✗ Mismatch
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {game.description}
                    </p>
                  </button>
                );
              })}
            </div>
            {loading && (
              <div className="text-center">
                <p className="text-muted-foreground">Analyzing...</p>
              </div>
            )}
          </div>
        )}

        {/* Screen 3: Game-Aligned Rewrite */}
        {step === 3 && analysis && selectedGame && selectedEpisode && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Same content. Correct game.
              </h2>
            </div>

            {/* Fit Check */}
            {analysis.alignment > 0 && (
              <div className="question-card text-center">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2 font-mono uppercase tracking-wider">
                    Alignment with {games.find((g) => g.id === selectedGame)?.name}
                  </p>
                  <p className="text-6xl font-bold text-foreground" style={{ color: 'var(--gold)' }}>
                    {analysis.alignment}%
                  </p>
                </div>
                {analysis.failures && analysis.failures.length > 0 && (
                  <div className="mt-6 text-left">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Why this {analysis.alignment < 50 ? "struggles" : "works"} for this game
                    </h3>
                    <ul className="space-y-2 pl-6 list-disc text-foreground">
                      {(analysis.failures || []).map((failure, i) => (
                        <li key={i}>{failure}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Rewritten Summary */}
            <div className="question-card">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Game-Aligned Summary
              </h3>
              <div className="space-y-4 text-lg leading-8 text-foreground">
                {analysis.gameAlignedSummary ? (
                  <p className="italic text-muted-foreground">
                    "{analysis.gameAlignedSummary}"
                  </p>
                ) : (
                  <p className="italic text-muted-foreground">
                    Generating game-aligned summary...
                  </p>
                )}
              </div>
            </div>

            {/* Callout */}
            <div className="result-card text-center">
              <p className="text-xl font-semibold text-foreground">
                "This version attracts fewer people — and the right ones."
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(4)}
                className="button"
              >
                See the Insight →
              </button>
            </div>
          </div>
        )}

        {/* Screen 4: Quiet Punchline (Optional) */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                The Quiet Punchline
              </h2>
            </div>

            <div className="question-card" style={{ borderLeft: '4px solid var(--gold)' }}>
              <p className="text-2xl font-semibold text-foreground mb-6">
                "Most creators don't fail because they lack quality.<br />
                They fail because they let the wrong game leak into their system."
              </p>
            </div>

            <div className="question-card">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                What the Game Audit Does
              </h3>
              <ul className="space-y-3 pl-6 list-disc text-lg leading-8 text-foreground">
                <li>Identifies your primary game</li>
                <li>Shows where your content drifts</li>
                <li>Defines AI / VA guardrails</li>
                <li>Tunes for your audience, not the algorithm</li>
              </ul>
            </div>

            <div className="text-center space-y-6">
              <Link
                href="/quiz"
                className="button"
              >
                Get Your Game Audit
              </Link>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                No pressure. The demo already sold it.
              </p>
            </div>

            <div className="text-center pt-8 border-t border-border">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Return to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
