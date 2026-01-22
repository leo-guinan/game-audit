"use client";

import { useState } from "react";

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
}: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(successMessage);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not subscribe. Try again later.");
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
