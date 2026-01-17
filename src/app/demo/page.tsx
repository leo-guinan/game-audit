"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Episode = {
  id: string;
  title: string;
  game: string;
  nativeGames?: string[];
  premise?: string;
};

type Persona = {
  id: string;
  name: string;
  emoji: string;
  problem: string;
  primaryGames: string[];
  success: string;
  accentColor?: string;
};

type Analysis = {
  alignment: number;
  failures: string[];
  genericSummary: string;
  reactions: {
    type: string;
    reactions: string[];
  };
  audienceEngagement: {
    aligned: number;
    misaligned1: number;
    misaligned2: number;
  };
  audienceScenarios?: Array<{
    problem: string;
    background: string;
    reaction: string;
    helped: string;
    missed: string;
  }>;
  personaReaction?: {
    summary: string;
    helped: string[];
    missed: string[];
  };
};

const personas: Persona[] = [
  {
    id: "independent-author",
    name: "The Independent Author",
    emoji: "📘",
    problem: "Traditional vs self-publishing decision",
    primaryGames: ["G2", "G4"],
    success: "Clear ROI framework + control",
    accentColor: "blue",
  },
  {
    id: "systems-thinker",
    name: "The Systems Thinker",
    emoji: "🧠",
    problem: "Understanding leverage vs distribution",
    primaryGames: ["G3"],
    success: "Transferable mental model",
    accentColor: "purple",
  },
  {
    id: "community-builder",
    name: "The Community Builder",
    emoji: "🧑‍🤝‍🧑",
    problem: "Building durable audience trust",
    primaryGames: ["G6"],
    success: "Long-term cohesion, not virality",
    accentColor: "green",
  },
  {
    id: "meaning-seeker",
    name: "The Meaning-Seeker",
    emoji: "🧭",
    problem: "Navigating identity change via work",
    primaryGames: ["G5"],
    success: "Narrative clarity + orientation",
    accentColor: "orange",
  },
];

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
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load episodes
    fetch("/api/demo/episodes")
      .then((res) => res.json())
      .then((data) => setEpisodes(data))
      .catch(console.error);
  }, []);

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    // Don't auto-advance, wait for persona selection
  };

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    // Still don't auto-advance - user clicks continue after both selected
  };

  const handleEpisodePersonaContinue = async () => {
    if (!selectedEpisode || !selectedPersona) return;
    setLoading(true);
    setStep(1);
    
    // Load generic summary (persona-agnostic)
    try {
      const response = await fetch("/api/demo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: selectedEpisode.id,
          selectedGame: "generic",
          personaId: selectedPersona.id, // Pass persona for context
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
    if (!selectedEpisode || !selectedPersona) return;
    setSelectedGame(gameId);
    setLoading(true);

    try {
      const response = await fetch("/api/demo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeId: selectedEpisode.id,
          selectedGame: gameId,
          personaId: selectedPersona.id,
        }),
      });
      const data = await response.json();
      setAnalysis(data);
      setStep(4);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGameFitForPersona = (gameId: string): "high" | "medium" | "low" => {
    if (!selectedPersona) return "medium";
    if (selectedPersona.primaryGames.includes(gameId)) return "high";
    // Could add more logic here for medium fit
    return "low";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 sm:text-5xl">
            The Interactive Alignment Simulator
          </h1>
          <p className="text-xl text-muted-foreground">
            Same content. Different games. Different outcomes.
          </p>
        </div>

        {/* Step 0: Choose Episode × Persona */}
        {step === 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Step 0: Choose an Episode × Persona
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Alignment is a three-body problem: Content × Game × Audience Persona
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Episode Selector */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Episode</h3>
                <div className="space-y-3">
                  {episodes.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => handleEpisodeSelect(episode)}
                      className={`w-full p-4 border rounded-lg bg-card hover:border-primary hover:bg-primary/5 transition-all text-left ${
                        selectedEpisode?.id === episode.id
                          ? "border-primary bg-primary/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-foreground">
                          {episode.title}
                        </h4>
                      </div>
                      {episode.nativeGames && episode.nativeGames.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-1">
                          Native: {episode.nativeGames.join(", ")}
                        </p>
                      )}
                      {episode.premise && (
                        <p className="text-sm text-muted-foreground">
                          {episode.premise}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Persona Selector */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Persona</h3>
                <div className="space-y-3">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaSelect(persona)}
                      className={`w-full p-4 border rounded-lg bg-card hover:border-primary hover:bg-primary/5 transition-all text-left ${
                        selectedPersona?.id === persona.id
                          ? "border-primary bg-primary/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{persona.emoji}</span>
                        <h4 className="text-lg font-semibold text-foreground">
                          {persona.name}
                        </h4>
                      </div>
                      <p className="text-sm text-foreground mb-2">
                        <span className="font-medium">Problem:</span> {persona.problem}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Primary Game: {persona.primaryGames.join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Success: {persona.success}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            {selectedEpisode && selectedPersona && (
              <div className="text-center pt-6 border-t">
                <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground font-medium">
                    Simulating how <span className="font-semibold">{selectedPersona.name}</span> experiences <span className="font-semibold">{selectedEpisode.title}</span>
                  </p>
                </div>
                <button
                  onClick={handleEpisodePersonaContinue}
                  disabled={loading}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Generic Summary (Persona-Agnostic) */}
        {step === 1 && selectedEpisode && selectedPersona && (

          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Step 1: Generic Summary (Persona-Agnostic)
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                This is what a neutral system produces when it ignores audience context.
              </p>
            </div>
            <div className="p-8 border rounded-lg bg-muted/30">
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : (
                <div className="space-y-4 text-lg leading-8 text-foreground">
                  <p className="italic text-muted-foreground">
                    "{analysis?.genericSummary || "This episode discusses the importance of focus, long-term thinking, and disciplined execution as key drivers of sustained success."}"
                  </p>
                  <p className="text-sm text-muted-foreground pt-4">
                    No persona cues. No game cues. This builds trust before we show the persona-specific fit.
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                Continue to Step 2 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Game (Persona-Aware) */}
        {step === 2 && selectedPersona && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Step 2: Choose a game to apply
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Now decide what game this content is trying to play.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {games.map((game) => {
                const fit = getGameFitForPersona(game.id);
                return (
                  <button
                    key={game.id}
                    onClick={() => handleGameSelect(game.id)}
                    disabled={loading}
                    className={`p-6 border rounded-lg bg-card hover:border-primary hover:bg-primary/5 transition-all text-left disabled:opacity-50 ${
                      fit === "high" ? "border-green-500/50 bg-green-500/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {game.id} — {game.name}
                      </h3>
                      {fit === "high" && (
                        <span className="text-green-600 font-semibold text-sm">
                          ✓✓ High fit
                        </span>
                      )}
                      {fit === "low" && (
                        <span className="text-yellow-600 font-semibold text-sm">
                          ⚠️ Likely mismatch
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

        {/* Step 3: Fit Check (Game × Episode × Persona) */}
        {step === 4 && analysis && selectedGame && selectedPersona && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Step 3: Fit Check (Game × Episode × Persona)
              </h2>
            </div>

            {/* Fit Score */}
            <div className="p-8 border rounded-lg bg-card text-center">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Fit for {selectedPersona.name}
                </p>
                <p className="text-6xl font-bold text-foreground">
                  {analysis.alignment}%
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Fit measures whether this content solves the persona's problem when played as this game.
              </p>
            </div>

            {/* Why it fails/passes */}
            <div className="p-8 border rounded-lg bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Why this {analysis.alignment < 50 ? "struggles" : "works"} for {games.find((g) => g.id === selectedGame)?.name}
              </h3>
              <ul className="space-y-2 pl-6 list-disc text-foreground">
                {analysis.failures.map((failure, i) => (
                  <li key={i}>{failure}</li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(5)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                See Persona Reaction →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Persona Reaction Panel */}
        {step === 5 && analysis && selectedPersona && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Step 4: Persona Reaction Panel
              </h2>
            </div>

            {/* Persona Snapshot */}
            <div className="p-6 border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedPersona.emoji}</span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedPersona.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Problem: {selectedPersona.problem}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Game lens: {selectedPersona.primaryGames.join(", ")}
                  </p>
                </div>
              </div>

              {/* Reaction Summary */}
              {analysis.audienceScenarios && analysis.audienceScenarios.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Reaction
                  </h4>
                  <p className="text-foreground">
                    {analysis.audienceScenarios[0]?.reaction || "Positive, but incomplete. The emphasis resonates, but lacks concrete decision criteria."}
                  </p>
                </div>
              )}

              {/* What Helped / What Was Missing */}
              {analysis.audienceScenarios && analysis.audienceScenarios.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                      ✅ Solved for me
                    </h4>
                    <p className="text-foreground text-sm">
                      {analysis.audienceScenarios[0]?.helped || "The emphasis on reader relationships and control resonates with my goals."}
                    </p>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                      ❌ Still unresolved
                    </h4>
                    <p className="text-foreground text-sm">
                      {analysis.audienceScenarios[0]?.missed || "Lacks concrete decision criteria and ROI framework for making the final choice."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Audience Engagement Distribution (Persona-Scoped) */}
            <div className="p-8 border rounded-lg bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Expected Engagement From This Persona's World
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Engagement weighted by people who share this problem.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground">Aligned audience</span>
                    <span className="text-foreground font-semibold">
                      {analysis.audienceEngagement.aligned}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${analysis.audienceEngagement.aligned}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground">Misaligned group 1</span>
                    <span className="text-foreground font-semibold">
                      {analysis.audienceEngagement.misaligned1}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full transition-all"
                      style={{ width: `${analysis.audienceEngagement.misaligned1}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground">Misaligned group 2</span>
                    <span className="text-foreground font-semibold">
                      {analysis.audienceEngagement.misaligned2}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full transition-all"
                      style={{ width: `${analysis.audienceEngagement.misaligned2}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-6 text-center text-muted-foreground italic">
                "Most engagement comes from people not playing the game you intended."
              </p>
            </div>

            {/* Audience Scenarios */}
            <div className="p-8 border rounded-lg bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Audience Scenarios
              </h3>
              {analysis.audienceScenarios && analysis.audienceScenarios.length > 0 ? (
                <div className="space-y-6">
                  {analysis.audienceScenarios.map((scenario, i) => (
                    <div
                      key={i}
                      className={`p-6 rounded-lg border ${
                        analysis.reactions.type.includes("aligned")
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/50 border-border"
                      }`}
                    >
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-1">Problem</div>
                        <p className="text-foreground font-medium">{scenario.problem}</p>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-1">Background</div>
                        <p className="text-foreground text-sm">{scenario.background}</p>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-1">Reaction</div>
                        <p className="text-foreground">{scenario.reaction}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">✅ What Helped</div>
                          <p className="text-foreground text-sm">{scenario.helped}</p>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">❌ What They Missed</div>
                          <p className="text-foreground text-sm">{scenario.missed}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {analysis.reactions.reactions.map((reaction, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${
                        analysis.reactions.type.includes("aligned")
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-foreground">{reaction}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(6)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                See Rewritten Version →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Game-Aligned Rewrite (Persona-Aware) */}
        {step === 6 && analysis && selectedGame && selectedEpisode && selectedPersona && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Step 5: Rewritten for {selectedPersona.name} Playing {games.find((g) => g.id === selectedGame)?.name}
              </h2>
            </div>

            <div className="p-8 border rounded-lg bg-card">
              <div className="space-y-4 text-lg leading-8 text-foreground">
                <p className="font-semibold mb-4">Game-Aligned Summary:</p>
                <p className="italic text-muted-foreground">
                  {selectedGame === "G1"
                    ? "Bill Gates as founder archetype: what sacrifice and focus actually cost, and why most people can't sustain it. This isn't inspiration — it's lineage. The episode traces how fanatical commitment shapes not just success, but identity. Who you become matters more than what you achieve."
                    : selectedGame === "G2"
                    ? "Extractable plays from Gates's approach: (1) Define measures of success that align with your strengths, (2) Use constraints as advantages, (3) Build systems that reward your obsessive focus. Each tactical move is reproducible — if you're willing to pay the cost."
                    : "The underlying model: Focus compounds when it matches your innate strengths. Gates's system wasn't about discipline — it was about designing a company that naturally rewarded his obsessive personality. The constraint → leverage loop applies beyond tech."}
                </p>
              </div>
            </div>

            {/* Updated Engagement */}
            <div className="p-8 border-2 border-primary rounded-lg bg-primary/5">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Updated Engagement Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground">Aligned audience</span>
                    <span className="text-foreground font-semibold">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: "78%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground">Misaligned groups</span>
                    <span className="text-foreground font-semibold">22%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: "22%" }} />
                  </div>
                </div>
              </div>
              <p className="mt-6 text-center font-semibold text-foreground">
                "Total engagement may drop. Meaningful engagement increases."
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(7)}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                See How This Would Perform For Your Audience →
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Conclusion & CTA */}
        {step === 7 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                The Quiet Punchline
              </h2>
            </div>

            <div className="p-8 border-l-4 border-primary bg-primary/5 rounded-r-lg">
              <p className="text-xl font-semibold text-foreground mb-6">
                "This is what happens accidentally when you don't specify a game."
              </p>
            </div>

            <div className="p-8 border rounded-lg bg-card">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                What the full Game Audit does
              </h3>
              <ul className="space-y-3 pl-6 list-disc text-lg leading-8 text-foreground">
                <li>Identifies your primary game</li>
                <li>Maps where your content drifts</li>
                <li>Defines guardrails for AI / VAs</li>
                <li>Tunes for your audience, not the algorithm</li>
              </ul>
            </div>

            <div className="text-center space-y-6">
              <Link
                href="/quiz"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xl hover:bg-primary/90 transition-colors"
              >
                Get Your Game Audit
              </Link>
              <p className="text-sm text-muted-foreground">
                No pressure. The demo already sold it.
              </p>
            </div>

            <div className="text-center pt-8 border-t">
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
