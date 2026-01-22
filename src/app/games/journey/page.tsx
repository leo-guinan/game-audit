"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFullJourney, getPathSummary, type FullJourney } from "@/lib/analytics/path-tracker";
import { analyzePath, type PathInterpretation } from "@/lib/analytics/path-analyzer";
import { trackFathomEvent, GameEvents } from "@/lib/analytics/fathom";
import { getGameConfig } from "@/lib/games";

const GAME_NAMES: Record<number, string> = {
  1: "Identity/Canon",
  2: "Idea Mining",
  3: "Model/Understanding",
  4: "Performance/Coaching",
  5: "Meaning/Sensemaking",
  6: "Network/Coordination",
};

export default function JourneyRevealPage() {
  const router = useRouter();
  const [journey, setJourney] = useState<FullJourney | null>(null);
  const [interpretation, setInterpretation] = useState<PathInterpretation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const fullJourney = getFullJourney(false);
    if (fullJourney.gamesVisited.length === 0) {
      router.push("/games");
      return;
    }

    const analysis = analyzePath(fullJourney);
    setJourney(fullJourney);
    setInterpretation(analysis);
    setLoading(false);

    trackFathomEvent("journey_reveal_viewed", 1);
  }, [router]);

  const handleShare = async () => {
    if (!journey || !interpretation) return;
    setSharing(true);

    try {
      const response = await fetch("/api/games/journey/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journey,
          interpretation,
        }),
      });

      if (response.ok) {
        setShared(true);
        trackFathomEvent("journey_shared", 1);
      }
    } catch (error) {
      console.error("Failed to share journey:", error);
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = () => {
    if (!journey || !interpretation) return;
    
    // Create export package
    const exportData = createExportPackage(journey, interpretation);
    downloadAsZip(exportData);
    
    trackFathomEvent("journey_downloaded", 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your journey...</p>
      </div>
    );
  }

  if (!journey || !interpretation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No journey data found.</p>
        <Link href="/games" className="text-primary hover:underline ml-2">
          Start exploring →
        </Link>
      </div>
    );
  }

  const timeSpent = Math.round(journey.totalTime / 1000 / 60); // minutes

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Your Journey
        </h1>
        <p className="text-lg text-muted-foreground">
          You just played a game about playing games. Here's what I observed.
        </p>
      </header>

      {/* Your Path */}
      <section className="mb-12 p-8 border border-border bg-muted/30">
        <h2 className="text-2xl font-semibold mb-4">Your Path</h2>
        <div className="space-y-3 font-mono text-sm">
          <div>
            <span className="text-muted-foreground">Path signature:</span>{" "}
            <span className="text-primary font-bold">{interpretation.pathSignature}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Games visited:</span>{" "}
            <span className="text-foreground">
              {journey.gamesVisited.map((g) => GAME_NAMES[g.game]).join(", ")}
            </span>
          </div>
          {interpretation.entryPosition && (
            <div>
              <span className="text-muted-foreground">Entry point:</span>{" "}
              <span className="text-foreground capitalize">{interpretation.entryPosition}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Time spent:</span>{" "}
            <span className="text-foreground">{timeSpent} minutes</span>
          </div>
          <div>
            <span className="text-muted-foreground">Engagement pattern:</span>{" "}
            <span className="text-foreground capitalize">{interpretation.engagementPattern}</span>
          </div>
        </div>
      </section>

      {/* Interpretation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What I Think This Means</h2>
        <div className="space-y-6">
          <div className="p-6 border-l-4 border-primary bg-muted/30">
            <h3 className="font-semibold mb-2">Primary Struggle</h3>
            <p className="text-foreground leading-relaxed">
              {interpretation.interpretation.primaryStruggle}
            </p>
          </div>

          {interpretation.interpretation.secondaryPattern && (
            <div className="p-6 border-l-4 border-primary/50 bg-muted/20">
              <h3 className="font-semibold mb-2">Secondary Pattern</h3>
              <p className="text-foreground leading-relaxed">
                {interpretation.interpretation.secondaryPattern}
              </p>
            </div>
          )}

          <div className="p-6 border-l-4 border-primary/30 bg-muted/10">
            <h3 className="font-semibold mb-2">Engagement Style</h3>
            <p className="text-foreground leading-relaxed">
              {interpretation.interpretation.engagementStyle}
            </p>
          </div>

          {interpretation.interpretation.predictedInterests.length > 0 && (
            <div className="p-6 border-l-4 border-primary/20 bg-muted/5">
              <h3 className="font-semibold mb-2">You Might Be Interested In</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                {interpretation.interpretation.predictedInterests.map((interest, i) => (
                  <li key={i}>{interest}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* The Choice */}
      <section className="mb-12 p-8 border-2 border-primary/30 bg-primary/5">
        <h2 className="text-2xl font-semibold mb-4">The Choice</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          I can use this to personalize what I send you. Different paths get different sequences.
          Your journey tells me what you're actually wrestling with, not just what you say you want.
        </p>
        <p className="text-foreground mb-6 font-medium">
          But this is your data. Your journey. Your self-portrait.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={handleShare}
            disabled={sharing || shared}
            className="p-6 border border-primary bg-primary/10 hover:bg-primary/20 transition-colors text-left disabled:opacity-50"
          >
            <div className="font-semibold mb-2">Share this with Leo</div>
            <div className="text-sm text-muted-foreground">
              {shared
                ? "✓ Shared! I'll use it to personalize your experience."
                : "I'll use it to send you things that match where you actually are."}
            </div>
          </button>

          <Link
            href="/games"
            className="p-6 border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-left block"
          >
            <div className="font-semibold mb-2">Keep this private</div>
            <div className="text-sm text-muted-foreground">
              Subscribe anyway, get the standard sequence. No hard feelings.
            </div>
          </Link>

          <button
            onClick={handleDownload}
            className="p-6 border border-border bg-muted/30 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="font-semibold mb-2">Download your data</div>
            <div className="text-sm text-muted-foreground">
              Take your path signature. It's yours. Do what you want with it.
            </div>
          </button>
        </div>
      </section>

      {/* Continue Exploring */}
      <section className="text-center">
        <Link
          href="/games"
          className="inline-block px-6 py-3 border border-border hover:border-primary transition-colors"
        >
          Continue exploring →
        </Link>
      </section>
    </article>
  );
}

function createExportPackage(journey: FullJourney, interpretation: PathInterpretation) {
  const journeyData = {
    your_journey: {
      path_signature: interpretation.pathSignature,
      games_visited: journey.gamesVisited.map((g) => GAME_NAMES[g.game]),
      time_spent: `${Math.round(journey.totalTime / 1000 / 60)} minutes`,
      entry_point: interpretation.entryPosition,
      deepest_engagement: getDeepestEngagement(journey),
    },
    my_interpretation: {
      primary_struggle: interpretation.interpretation.primaryStruggle,
      secondary_pattern: interpretation.interpretation.secondaryPattern,
      engagement_style: interpretation.interpretation.engagementStyle,
      predicted_interests: interpretation.interpretation.predictedInterests,
    },
    exported_at: new Date().toISOString(),
    this_data_belongs_to: "you",
  };

  return {
    "journey-data.json": JSON.stringify(journeyData, null, 2),
    "my-interpretation.md": createInterpretationMarkdown(interpretation),
    "prompts/01-the-mirror.md": getPrompt("mirror"),
    "prompts/02-the-gap.md": getPrompt("gap"),
    "prompts/03-the-integration.md": getPrompt("integration"),
    "prompts/04-the-comparison.md": getPrompt("comparison"),
    "prompts/05-the-conversation.md": getPrompt("conversation"),
    "README.md": getReadme(),
  };
}

function getDeepestEngagement(journey: FullJourney): string {
  let maxTime = 0;
  let deepest = "";
  journey.gamesVisited.forEach((g) => {
    Object.entries(g.timePerNode).forEach(([node, time]) => {
      if (time > maxTime) {
        maxTime = time;
        deepest = node;
      }
    });
  });
  return deepest || "intro";
}

function createInterpretationMarkdown(interpretation: PathInterpretation): string {
  return `# My Interpretation

## Primary Struggle

${interpretation.interpretation.primaryStruggle}

${interpretation.interpretation.secondaryPattern ? `## Secondary Pattern\n\n${interpretation.interpretation.secondaryPattern}\n\n` : ""}## Engagement Style

${interpretation.interpretation.engagementStyle}

## Predicted Interests

${interpretation.interpretation.predictedInterests.map((i) => `- ${i}`).join("\n")}
`;
}

function getPrompt(type: string): string {
  const prompts: Record<string, string> = {
    mirror: `## Context

I just completed an interactive essay about "the 6 games" people play online—different ways of creating value (Identity, Ideas, Models, Performance, Meaning, Network).

The essay tracked my journey. Here's my data:

[PASTE YOUR JOURNEY DATA HERE]

## Request

Based on my path through this essay:

1. What does my entry point suggest about how I currently see myself?
2. What does my navigation pattern suggest about how I process decisions?
3. What might the combination of games I visited reveal about what I'm actually wrestling with?
4. What's one question I should ask myself based on this journey?

Be direct. I can handle an honest reading.`,
    gap: `## Context

I completed an interactive essay about 6 games people play online.
Here's my journey data:

[PASTE YOUR JOURNEY DATA HERE]

## The 6 Games (for reference)

1. Identity/Canon — "Who should people become?"
2. Idea/Play Mining — "What can we extract and apply?"
3. Model/Understanding — "How does this actually work?"
4. Performance/Coaching — "How do you get better results?"
5. Meaning/Sensemaking — "What does this mean for how we live?"
6. Network/Coordination — "Who should be connected?"

## Request

Looking at which games I visited and which I avoided:

1. Which games did I skip entirely? What might that avoidance suggest?
2. Is there a game that might be relevant to my situation that I didn't explore?
3. What's the shadow side of the path I took—what might I be blind to?
4. If I were mixing games without realizing it, what combination does my path suggest?`,
    integration: `## Context

I completed an interactive essay diagnosing which "game" I'm playing in my online/creative/professional life.

Here's my journey data:

[PASTE YOUR JOURNEY DATA HERE]

I'll also share some context about my current situation:

[DESCRIBE YOUR SITUATION: what you're building, where you feel stuck, what you're trying to figure out]

## Request

Given my path through the essay AND my actual situation:

1. How does my self-diagnosis in the essay match or conflict with my described situation?
2. What's one concrete thing my path signature suggests I should try?
3. What's one thing I should stop doing?
4. If I could only focus on one game for the next 90 days, which one would give me the most leverage—and why?`,
    comparison: `## Context

I completed an interactive essay with path tracking. 

My data:

[PASTE YOUR JOURNEY DATA HERE]

The essay also told me:
- My path signature is taken by [X]% of readers
- Most people who enter where I did go to [Y] next
- I diverged by going to [Z] instead

## Request

1. What might my divergence from the common path suggest about how I think differently?
2. Is my uncommon path a strength or a potential blind spot?
3. What do people who take the common path probably see that I might be missing?
4. What do I probably see that they're missing?`,
    conversation: `## Context

I just went through an interactive essay about the 6 games people play online. My journey data is below. 

I want to have a conversation about what this reveals.

[PASTE YOUR JOURNEY DATA HERE]

## Starting Point

Based on this data, ask me the single most important question I should be sitting with right now. Then let's explore from there.`,
  };
  return prompts[type] || "";
}

function getReadme(): string {
  return `# Your Game Journey

You just played a game about playing games.

This folder contains:
- Your journey data (what you did)
- My interpretation (what I think it means)
- Prompts for your own exploration (what you can discover)

## How to use

1. Open your preferred LLM (Claude, ChatGPT, etc.)
2. Pick a prompt from /prompts
3. Paste in your journey data from journey-data.json
4. Explore

These prompts are starting points. Modify them. Go further. 
The data is yours. The interpretation is yours to make.

If you discover something interesting, I'd love to hear about it.
[Reply link / email]

— Leo
`;
}

function downloadAsZip(files: Record<string, string>) {
  // For now, create a simple download of the JSON
  // In production, you'd use a library like JSZip
  const blob = new Blob([files["journey-data.json"]], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "your-game-journey.json";
  a.click();
  URL.revokeObjectURL(url);
}
