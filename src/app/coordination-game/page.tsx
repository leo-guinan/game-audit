"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import { SignupForm } from "@/components/coordination-game/signup-form";

export default function CoordinationGamePage() {
  useEffect(() => {
    function reveal() {
      const els = document.querySelectorAll(".reveal");
      const h = window.innerHeight;
      els.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < h - 150) el.classList.add("active");
      });
    }
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Header / Hero */}
        <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8 text-center">
            <div className="flex justify-center mb-8">
              <Link href="/" className="flex items-center no-underline">
                <Image
                  src="/logo.png"
                  alt="MetaSPN"
                  width={160}
                  height={53}
                  priority
                  className="logo-image"
                />
              </Link>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              The Coordination Game
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Weekly insights on the invisible games governing trust, alignment,
              and collective action.
            </p>
            <div className="reveal max-w-xl mx-auto">
              <SignupForm variant="inline" />
            </div>
            <p className="mt-6 text-sm text-muted-foreground font-mono">
              Published every Monday • 5–7 minute read • 28 readers
            </p>
          </div>
        </section>

        {/* Problem */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8">
            <div className="section-label reveal">— The Problem</div>
            <div className="reveal insight-box">
              <p className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-6">
                Most systems don&apos;t fail because people stop trying.
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-foreground leading-snug mb-6">
                They fail because people keep trying to win the wrong game.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Every human system—teams, companies, communities,
                institutions—operates inside a game, whether anyone names it or
                not.
              </p>
              <p className="text-foreground text-lg leading-relaxed font-medium">
                This newsletter helps you see the game before it forces a
                reckoning.
              </p>
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8">
            <div className="section-label reveal">What You&apos;ll Learn</div>
            <p className="text-muted-foreground text-lg mb-8 reveal">
              Each week, The Coordination Game explores:
            </p>
            <ul className="space-y-4 mb-10 reveal">
              {[
                "What game is actually being played",
                "Where coordination is quietly degrading",
                "Which signals matter more than the scoreboard",
                "How systems break—or transform—before it becomes obvious",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-foreground font-medium"
                >
                  <span className="text-primary font-mono mt-0.5">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-lg reveal">
              This isn&apos;t about hot takes or predictions.
            </p>
            <p className="text-foreground text-lg font-medium reveal">
              It&apos;s about pattern recognition under uncertainty.
            </p>
          </div>
        </section>

        {/* Recent Issues */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8">
            <div className="section-label reveal">Recent Issues</div>
            <div className="space-y-8 reveal">
              {[
                {
                  issue: 3,
                  title: "Trust Is Not a Feeling. It's a Resource",
                  desc: "Systems don't collapse when trust drops—they collapse when trust is consumed faster than it's regenerated.",
                },
                {
                  issue: 2,
                  title: "When the Scoreboard Lies",
                  desc: "By the time a scoreboard updates, the underlying system has often already shifted. That gap is where coordination failures are born.",
                },
                {
                  issue: 1,
                  title: "The Game You're Already Playing",
                  desc: "Learning to notice when the game shifts—personally or collectively—is a skill. That skill can be practiced.",
                },
              ].map(({ issue, title, desc }) => (
                <div
                  key={issue}
                  className="p-6 border border-border bg-muted/30 hover:border-primary/40 transition-colors"
                >
                  <div className="font-mono text-sm text-primary mb-2">
                    Issue #{issue}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 reveal">
              <Link
                href="/coordination-game/issues"
                className="font-mono text-sm text-primary hover:underline"
              >
                Browse all issues →
              </Link>
            </p>
          </div>
        </section>

        {/* About */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8">
            <div className="section-label reveal">About the Author</div>
            <div className="reveal">
              <p className="text-foreground text-lg font-medium mb-4">
                I&apos;m Leo Guinan. I make online games observable.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                After analyzing 100+ podcasts, newsletters, and creator
                businesses, I&apos;ve identified the patterns that cause
                coordination to break before performance does.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The Coordination Game newsletter is part of{" "}
                <strong className="text-foreground">MetaSPN</strong>—a network
                making invisible games visible through diagnostics, workshops,
                and frameworks.
              </p>
              <p className="text-muted-foreground text-lg mb-4">
                Currently offering:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Creator Game Audit Workshop (live diagnostic)",
                  "The Game of Programming (teaching CS through games)",
                  "The Coordination Game (this newsletter)",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="text-primary">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="font-mono text-sm text-primary hover:underline"
              >
                Learn more about MetaSPN →
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-2xl px-6 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 reveal">
              Join 28 readers getting weekly insights on coordination, trust, and
              systems.
            </h2>
            <div className="reveal">
              <SignupForm
                variant="stacked"
                showReassurance
                className="flex flex-col items-center"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              MetaSPN
            </Link>
            <Link
              href="/discover"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/compare"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Compare
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
