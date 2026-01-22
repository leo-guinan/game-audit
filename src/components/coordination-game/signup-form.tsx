"use client";

import { useState } from "react";
import { trackFathomEvent, GameEvents } from "@/lib/analytics/fathom";
import { getPathSummary, getFullJourney } from "@/lib/analytics/path-tracker";
import { analyzePath } from "@/lib/analytics/path-analyzer";

interface SignupFormProps {
  variant?: "inline" | "stacked";
  showReassurance?: boolean;
  className?: string;
  /** API path to POST { email } to. Default: /api/coordination-game/subscribe */
  apiPath?: string;
  /** Button label. Default: Subscribe */
  ctaLabel?: string;
  /** Button label when loading. Default: Subscribing… */
  loadingLabel?: string;
  /** Success message. Default: Thanks! Check your inbox to confirm. */
  successMessage?: string;
  /** Custom reassurance text when showReassurance. Overrides default. */
  reassurance?: string;
  /** If false, button label is not uppercased (e.g. "Get the course →"). Default: true */
  ctaUppercase?: boolean;
  /** Source identifier for tracking (e.g. "coordination_game", "creator_game") */
  source?: string;
}

export function SignupForm({
  variant = "inline",
  showReassurance = false,
  className = "",
  apiPath = "/api/coordination-game/subscribe",
  ctaLabel = "Subscribe",
  loadingLabel = "Subscribing…",
  successMessage = "Thanks! Check your inbox to confirm.",
  reassurance,
  ctaUppercase = true,
  source = "coordination_game",
}: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    // Track attempt
    trackFathomEvent(GameEvents.subscribeAttempt(source));

    // Get path data
    const pathSummary = getPathSummary();
    const pathString = pathSummary.pathString;
    const pathSignature = pathSummary.pathSignature;
    const gamesPlayed = pathSummary.games.join(",");
    const lastNode = pathSummary.lastStep
      ? `${pathSummary.lastStep.nodeType}${pathSummary.lastStep.nodeId ? `_${pathSummary.lastStep.nodeId}` : ""}`
      : "";

    // Get full journey for detailed tracking
    const fullJourney = getFullJourney(false);
    const interpretation = analyzePath(fullJourney);

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          path: pathString,
          path_signature: pathSignature,
          games_played: gamesPlayed,
          last_node: lastNode,
          primary_game: interpretation.primaryGame,
          entry_position: interpretation.entryPosition,
          engagement_pattern: interpretation.engagementPattern,
          journey_data: fullJourney, // Full journey for detailed analysis
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        trackFathomEvent(GameEvents.subscribeError(source));
        return;
      }

      setStatus("success");
      setMessage(successMessage);
      setEmail("");
      trackFathomEvent(GameEvents.subscribeSuccess(source));
    } catch {
      setStatus("error");
      setMessage("Could not subscribe. Try again later.");
      trackFathomEvent(GameEvents.subscribeError(source));
    }
  }

  const isInline = variant === "inline";

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div
        className={
          isInline
            ? "flex flex-col sm:flex-row gap-3 max-w-xl"
            : "flex flex-col gap-3 max-w-md"
        }
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={status === "loading"}
          className="flex-1 w-full px-4 py-3 bg-muted border border-border text-foreground placeholder:text-muted-foreground font-sans text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`button flex-shrink-0 px-8 py-3 font-mono text-sm tracking-wider disabled:opacity-60 disabled:cursor-not-allowed ${ctaUppercase ? "uppercase" : "normal-case"} ${!isInline ? "w-full sm:w-auto" : ""}`}
        >
          {status === "loading" ? loadingLabel : ctaLabel}
        </button>
      </div>
      {showReassurance && (
        <p className="mt-3 text-sm text-muted-foreground">
          {reassurance ?? "No spam. Unsubscribe anytime. Published every Monday."}
        </p>
      )}
      {message && (
        <p
          className={`mt-3 text-sm font-mono ${
            status === "success" ? "text-primary" : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
