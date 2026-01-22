"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import { SignupForm } from "@/components/coordination-game/signup-form";

const DAYS = [
  { day: 1, title: "The problem (why good content doesn't compound)" },
  { day: 2, title: "Game 1 — Identity/Canon" },
  { day: 3, title: "Game 2 — Idea Mining" },
  { day: 4, title: "Game 3 — Model/Understanding" },
  { day: 5, title: "Game 4 — Performance/Coaching" },
  { day: 6, title: "Game 5 — Meaning/Sensemaking" },
  { day: 7, title: "Game 6 — Network/Coordination" },
  { day: 8, title: "The most common mistake (and how to fix it)" },
];

export default function CreatorGamePage() {
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
        {/* Hero */}
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
              The Creator Game
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A 6-day email course on the invisible games creators play
            </p>

            <div className="reveal max-w-xl mx-auto text-left">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Most creators who plateau aren&apos;t failing because of effort
                or talent.
              </p>
              <p className="text-foreground text-lg font-semibold leading-relaxed mb-6">
                They&apos;re failing because they&apos;re playing multiple games
                at once without realizing it.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                After analyzing 100+ podcasts and newsletters, I&apos;ve
                identified 6 core creator games. Most people unknowingly mix
                3–4 of them.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                That creates confusing content, weak leverage, and systems that
                drift.
              </p>
              <p className="text-foreground text-lg font-medium mb-8">
                This free email course helps you see which game you&apos;re
                actually playing.
              </p>
              <SignupForm
                variant="inline"
                apiPath="/api/creator-game/subscribe"
                ctaLabel="Get the course →"
                loadingLabel="Sending…"
                successMessage="Check your inbox for Day 1."
                ctaUppercase={false}
                source="creator_game"
              />
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto max-w-3xl px-6 sm:px-8">
            <div className="section-label reveal">What You&apos;ll Learn</div>
            <ul className="space-y-4 mb-10 reveal">
              {DAYS.map(({ day, title }) => (
                <li
                  key={day}
                  className="flex items-start gap-3 text-foreground font-medium"
                >
                  <span className="text-primary font-mono shrink-0">
                    Day {day}:
                  </span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
            <div className="reveal p-6 border border-primary/30 bg-primary/5">
              <p className="text-foreground font-medium mb-2">
                Plus: Access to my Feb 11 live workshop where I diagnose
                creators in real-time.
              </p>
              <p className="text-muted-foreground text-sm">
                Join the email course to get workshop details and replay access.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-2xl px-6 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 reveal">
              Get the free 6-day course
            </h2>
            <p className="text-muted-foreground mb-8 reveal">
              One email per day. No spam. Unsubscribe anytime.
            </p>
            <div className="reveal flex justify-center">
              <SignupForm
                variant="stacked"
                apiPath="/api/creator-game/subscribe"
                ctaLabel="Get the course →"
                loadingLabel="Sending…"
                successMessage="Check your inbox for Day 1."
                showReassurance
                reassurance="No spam. Unsubscribe anytime."
                ctaUppercase={false}
                source="creator_game"
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
              href="/coordination-game"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Newsletter
            </Link>
            <Link
              href="/discover"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Discover
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
