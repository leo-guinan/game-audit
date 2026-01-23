import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "MetaSPN Pro — See your thinking. Shape your influence.",
  description: "MetaSPN Pro is for people who don't just consume ideas — they want to observe how ideas change them, and how those changes propagate into the world.",
};

export default function ProPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block border border-primary bg-primary/5 px-4 py-2 font-mono text-sm uppercase tracking-wider text-primary">
            MetaSPN Pro
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            See your thinking. Shape your influence. Play the long game.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            MetaSPN Pro is for people who don't just consume ideas — they want to observe how ideas change them, and how those changes propagate into the world.
          </p>
          <div className="mb-12">
            <a
              href="https://buy.stripe.com/3cIcN59df7800hofk8eZ20S"
              target="_blank"
              rel="noopener noreferrer"
              className="button inline-block"
            >
              Subscribe — $20/month
            </a>
          </div>
        </div>

        {/* What Makes This Different */}
        <section className="mb-16 space-y-6">
          <p className="text-lg leading-8 text-foreground">
            Most software shows you <strong>what you did</strong>.
          </p>
          <p className="text-lg leading-8 text-foreground">
            MetaSPN shows you:
          </p>
          <ul className="space-y-3 pl-6 text-lg leading-8 text-foreground">
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              <strong>what influenced you</strong>
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              <strong>when it mattered</strong>
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              <strong>how long it echoed</strong>
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              <strong>and where it turned into output</strong>
            </li>
          </ul>
          <p className="pt-4 text-lg leading-8 text-foreground">
            This is a tool for people who treat thinking as a craft.
          </p>
        </section>

        {/* What You Get */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">What You Get</h2>
          
          <div className="mb-12 space-y-8">
            {/* Feature 1 */}
            <div className="border-l-4 border-primary bg-primary/5 p-8">
              <h3 className="mb-4 text-2xl font-semibold text-foreground">
                🧠 Your Personal Thought Ledger
              </h3>
              <p className="mb-4 text-lg leading-8 text-foreground">
                A private, local-first record of:
              </p>
              <ul className="mb-4 space-y-2 pl-6 text-lg leading-8 text-foreground">
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  what you listened to
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  what you finished
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  what you highlighted
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  what you wrote afterward
                </li>
              </ul>
              <p className="text-lg italic leading-8 text-muted-foreground">
                Not analytics for advertisers.
                <br />
                A ledger for your own cognition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-l-4 border-primary bg-primary/5 p-8">
              <h3 className="mb-4 text-2xl font-semibold text-foreground">
                📊 Influence Reports (Monthly & On-Demand)
              </h3>
              <p className="mb-4 text-lg leading-8 text-foreground">
                Automatically generated reports like:
              </p>
              <ul className="mb-4 space-y-2 pl-6 text-lg leading-8 text-foreground">
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  Top episodes that shaped your thinking this month
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  Topics that produced the most downstream writing
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  Fast vs slow integration patterns
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  Peak influence days
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  Ideas you consumed but never expressed
                </li>
              </ul>
              <p className="text-lg italic leading-8 text-muted-foreground">
                This is a mirror for your intellectual metabolism.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-l-4 border-primary bg-primary/5 p-8">
              <h3 className="mb-4 text-2xl font-semibold text-foreground">
                ✍️ Platform-Agnostic Notes → Git
              </h3>
              <p className="mb-4 text-lg leading-8 text-foreground">
                Every thought you capture:
              </p>
              <ul className="mb-4 space-y-2 pl-6 text-lg leading-8 text-foreground">
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  is stored in your own repository
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  in plain text
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  with full history
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  usable by any downstream tool
                </li>
              </ul>
              <p className="text-lg italic leading-8 text-muted-foreground">
                Your thinking becomes infrastructure, not platform exhaust.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-l-4 border-primary bg-primary/5 p-8">
              <h3 className="mb-4 text-2xl font-semibold text-foreground">
                🎧 Listener → Host Signal (Opt-in)
              </h3>
              <p className="mb-4 text-lg leading-8 text-foreground">
                If you choose to share:
              </p>
              <ul className="mb-4 space-y-2 pl-6 text-lg leading-8 text-foreground">
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  completion quality
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  highlight density
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                  long-term influence
                </li>
              </ul>
              <p className="mb-2 text-lg leading-8 text-foreground">
                You become a verified core fan, not just a download.
              </p>
              <p className="text-lg italic leading-8 text-muted-foreground">
                For hosts, this is the first signal that actually correlates with impact, not reach.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes This Different */}
        <section className="mb-16 border-t border-border pt-12">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">What Makes This Different</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Most products optimize for:</h3>
              <ul className="space-y-2 pl-6 text-lg leading-8 text-foreground">
                <li className="relative before:absolute before:-left-6 before:text-muted-foreground before:content-['×']">
                  engagement
                </li>
                <li className="relative before:absolute before:-left-6 before:text-muted-foreground before:content-['×']">
                  retention
                </li>
                <li className="relative before:absolute before:-left-6 before:text-muted-foreground before:content-['×']">
                  time spent
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">MetaSPN Pro optimizes for:</h3>
              <ul className="space-y-2 pl-6 text-lg leading-8 text-foreground">
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['✓']">
                  clarity
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['✓']">
                  integration
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['✓']">
                  long-term influence
                </li>
                <li className="relative before:absolute before:-left-6 before:text-primary before:content-['✓']">
                  aligned leverage
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 space-y-4 text-lg leading-8 text-foreground">
            <p>
              This is not a social network.
              <br />
              This is not a note app.
              <br />
              This is not an analytics dashboard.
            </p>
            <p className="font-semibold">
              It's a personal research instrument for your own mind.
            </p>
          </div>
        </section>

        {/* Open Source by Default */}
        <section className="mb-16 border-t border-border pt-12">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Open Source by Default</h2>
          <p className="mb-6 text-lg leading-8 text-foreground">
            All core software is open source.
          </p>
          <p className="mb-4 text-lg font-semibold leading-8 text-foreground">Why?</p>
          <p className="mb-6 text-lg leading-8 text-foreground">Because:</p>
          <ul className="mb-8 space-y-3 pl-6 text-lg leading-8 text-foreground">
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              serious users want inspectability
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              researchers want extensibility
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              builders want to fork, not reverse-engineer
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              trust comes from legibility
            </li>
          </ul>
          <div className="border-l-4 border-primary bg-primary/5 p-6">
            <p className="mb-4 text-lg leading-8 text-foreground">
              You're not paying for code.
            </p>
            <p className="mb-2 text-lg leading-8 text-foreground">You're paying for:</p>
            <ul className="space-y-2 pl-6 text-lg leading-8 text-foreground">
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                maintained pipelines
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                reliable reports
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                hosted services
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                curated defaults
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                and a game worth playing
              </li>
            </ul>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="mb-16 border-t border-border pt-12">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Who This Is For</h2>
          <p className="mb-6 text-lg leading-8 text-foreground">
            MetaSPN Pro is for:
          </p>
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <ul className="space-y-2 pl-6 text-lg leading-8 text-foreground">
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                founders
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                researchers
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                writers
              </li>
            </ul>
            <ul className="space-y-2 pl-6 text-lg leading-8 text-foreground">
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                builders
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                investors
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                and serious learners
              </li>
            </ul>
          </div>
          <p className="mb-4 text-lg leading-8 text-foreground">
            People who:
          </p>
          <ul className="mb-8 space-y-2 pl-6 text-lg leading-8 text-foreground">
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              listen to long-form content
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              write in public or private
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              care about how ideas compound
            </li>
            <li className="relative before:absolute before:-left-6 before:text-primary before:content-['→']">
              and want to see their own thinking evolve over time
            </li>
          </ul>
          <div className="border-l-4 border-primary bg-primary/5 p-6">
            <p className="text-lg italic leading-8 text-foreground">
              If you've ever wondered:
            </p>
            <p className="mt-2 text-xl font-semibold leading-8 text-foreground">
              "Which ideas actually shaped me this year?"
            </p>
            <p className="mt-4 text-lg leading-8 text-foreground">
              This is for you.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16 border-t border-border pt-12">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Pricing</h2>
          <div className="mb-8 border-l-4 border-primary bg-primary/5 p-8">
            <div className="mb-6">
              <div className="mb-2 text-4xl font-bold text-foreground">$20 / month</div>
              <p className="text-lg leading-8 text-muted-foreground">
                Anchored to the reality of modern software:
              </p>
            </div>
            <ul className="mb-6 space-y-2 pl-6 text-lg leading-8 text-foreground">
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                one serious tool
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                maintained continuously
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                priced to be sustainable
              </li>
              <li className="relative before:absolute before:-left-6 before:text-primary before:content-['•']">
                cheap compared to the time it saves
              </li>
            </ul>
            <p className="text-lg leading-8 text-muted-foreground">
              Cancel anytime.
              <br />
              Your data always remains yours.
            </p>
          </div>
          <div className="text-center">
            <a
              href="https://buy.stripe.com/3cIcN59df7800hofk8eZ20S"
              target="_blank"
              rel="noopener noreferrer"
              className="button inline-block"
            >
              Subscribe Now — $20/month
            </a>
          </div>
        </section>

        {/* Closing Line */}
        <section className="border-t border-border pt-12 text-center">
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">MetaSPN Pro</h2>
            <p className="text-xl leading-8 text-muted-foreground">
              Not a platform.
              <br />
              A practice.
            </p>
            <p className="text-lg leading-8 text-foreground">
              For people who take thinking seriously.
            </p>
          </div>
          <div className="mt-8">
            <a
              href="https://buy.stripe.com/3cIcN59df7800hofk8eZ20S"
              target="_blank"
              rel="noopener noreferrer"
              className="button inline-block"
            >
              Start Your Subscription
            </a>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="mt-16 border-t border-border pt-8 text-center">
          <Link
            href="/"
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
