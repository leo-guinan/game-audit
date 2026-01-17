import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            THE GAME AUDIT
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
            Identify the game you're actually playing — and why it's not working yet.
          </p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground sm:text-xl">
            Then lock that game in with guardrails your AI, VAs, and systems can't drift from.
          </p>
        </div>
      </section>

      {/* Hero Content */}
      <section className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            You're playing a game.
            <br />
            You might be playing the wrong one.
          </h2>
          <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            Most creators, founders, and hosts don't fail because they lack talent —
            they fail because their strategy doesn't match the game they're in.
          </p>
          <div className="pt-8">
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xl hover:bg-primary/90 transition-colors"
            >
              👉 Take the 3-minute Game Quiz
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              No email required · Instant results · Built from 100s of content audits
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          Why smart people keep spinning their wheels
        </h2>
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>You can be:</p>
          <ul className="space-y-3 pl-6 list-disc">
            <li>Publishing consistently</li>
            <li>Getting good feedback</li>
            <li>Interviewing impressive people</li>
            <li>Saying things that feel important</li>
            <li>Delegating or automating output that quietly breaks the game</li>
          </ul>
          <p className="pt-4">…and still see no leverage, no growth, no momentum.</p>
          <p className="font-semibold">Why?</p>
          <p>
            Most breakdowns aren't caused by bad execution —
            they're caused by systems optimizing for the wrong rules.
          </p>
          <p className="pt-2">
            Because different games reward different behaviors —
            and most people are unknowingly optimizing for the wrong one.
          </p>
          <div className="mt-8 p-6 border-l-4 border-primary bg-primary/5 rounded-r-lg">
            <p className="text-xl font-semibold text-foreground italic">
              "Clarity failures look like effort problems — until you name the game."
            </p>
          </div>
        </div>
      </section>

      {/* Core Insight */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          There isn't one "right" way to create value
        </h2>
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>
            There are distinct games, each with:
          </p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Different success metrics</li>
            <li>Different failure modes</li>
            <li>Different paths to leverage</li>
          </ul>
          <p className="pt-4 font-semibold">
            Trying to win the wrong game creates frustration that no amount of effort fixes.
          </p>
          <div className="mt-8 space-y-3">
            <p className="font-semibold">Examples:</p>
            <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
              <li>Teaching when your audience needs execution</li>
              <li>Interviewing when your edge is synthesis</li>
              <li>Building canon when you need momentum</li>
              <li>Optimizing signal when your problem is clarity</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI/VA Section */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          Why scale breaks alignment before it breaks quality
        </h2>
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>
            AI systems and VAs don't fail because they're low-quality.
            <br />
            They fail because they optimize locally — while games are global.
          </p>
          <p>Without explicit game constraints, systems drift toward:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>The wrong success metrics</li>
            <li>The wrong tone and structure</li>
            <li>The wrong form of leverage</li>
          </ul>
          <p className="pt-4">
            The result looks like productivity.
            <br />
            It feels like momentum.
            <br />
            <strong>But it's off-game.</strong>
          </p>
        </div>
      </section>

      {/* Solution - The Quiz */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          The fastest way to find your real constraint
        </h2>
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>The Game Quiz identifies:</p>
          <ul className="space-y-3 pl-6 list-disc">
            <li>The primary game you're currently playing</li>
            <li>The secondary game pulling you off course</li>
            <li>The exact failure mode that's limiting your results</li>
          </ul>
          <p className="pt-4 font-semibold">
            No theory. No personality fluff.
            <br />
            Just pattern recognition from real audits.
          </p>
          <div className="mt-8 text-center space-y-4">
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xl hover:bg-primary/90 transition-colors"
            >
              👉 Take the Game Quiz
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              3 minutes · Multiple choice · No trick questions
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">Or try the interactive demo:</p>
              <Link
                href="/demo"
                className="inline-block px-6 py-3 border border-border rounded-lg font-medium hover:border-primary hover:bg-primary/5 transition-colors"
              >
                See Alignment Simulator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-12">
          What you'll see after the quiz
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold text-primary mb-4">1</div>
            <h3 className="text-xl font-bold text-foreground mb-3">Your Primary Game</h3>
            <p className="text-muted-foreground">
              The game your content actually plays — whether you intended it or not.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold text-primary mb-4">2</div>
            <h3 className="text-xl font-bold text-foreground mb-3">Your Failure Pattern</h3>
            <p className="text-muted-foreground">
              The most common way people lose this game (and how it shows up).
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold text-primary mb-4">3</div>
            <h3 className="text-xl font-bold text-foreground mb-3">Your Best Next Move</h3>
            <p className="text-muted-foreground">
              Whether you need structural fixes, clearer leverage, better compression, stronger positioning, or a full audit.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-3xl font-bold text-primary mb-4">4</div>
            <h3 className="text-xl font-bold text-foreground mb-3">Your Game Guardrails</h3>
            <p className="text-muted-foreground">
              The constraints your content, systems, and delegates must obey —
              regardless of who (or what) produces the output.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          Built from real-world analysis
        </h2>
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>This framework is derived from:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Long-running podcasts</li>
            <li>Founder interviews</li>
            <li>Educational creators</li>
            <li>Network-driven shows</li>
          </ul>
          <p className="pt-4 text-muted-foreground">
            Across different sizes, stages, and audiences —
            the same game patterns repeat.
          </p>
          <p className="pt-4 font-semibold">
            The difference between stalled and compounding work is almost always structural.
          </p>
        </div>
      </section>

      {/* The Audit - Soft Intro */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          If you want precision, not guesses
        </h2>
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>
            For people who want to go deeper, each game maps to a tailored Game Audit:
          </p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Episode-level analysis</li>
            <li>Structural diagnosis</li>
            <li>Clear recommendations</li>
            <li>No fluff, no templates</li>
          </ul>
          <p className="pt-4">
            You'll see the relevant audit after your results —
            only if it actually applies to you.
          </p>
          <p className="pt-4">
            Each Game Audit can be translated into:
          </p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>AI prompt constraints</li>
            <li>VA review checklists</li>
            <li>Content acceptance criteria</li>
          </ul>
          <p className="pt-4">
            So quality doesn't depend on taste, vigilance, or taste battles —
            it's enforced structurally.
          </p>
          <p className="text-muted-foreground italic pt-4">
            No pressure. The quiz stands on its own.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
          FAQ
        </h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Q: Is this a personality test?</h3>
            <p className="text-lg text-muted-foreground">
              No. It's a structural diagnosis based on how your work functions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Q: Is this only for podcasters?</h3>
            <p className="text-lg text-muted-foreground">
              No. It applies to creators, founders, writers, educators, and hosts.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Q: Do I need a big audience?</h3>
            <p className="text-lg text-muted-foreground">
              No. In fact, this is most useful before scale.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Q: Will I be sold to immediately?</h3>
            <p className="text-lg text-muted-foreground">
              No. You'll see your results first. Always.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Q: Is this about automating content?</h3>
            <p className="text-lg text-muted-foreground">
              No. It's about preventing automation from breaking your strategy.
              The audit defines what must not change — even as output scales.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-24 max-w-3xl px-6 pb-24 sm:px-8">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Find the game. Fix the strategy.
            <br />
            Stop guessing.
          </h2>
          <div>
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xl hover:bg-primary/90 transition-colors"
            >
              👉 Take the Game Quiz
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Designed for people who think in systems, not hacks.
          </p>
        </div>
      </section>
    </div>
  );
}
