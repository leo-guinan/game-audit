import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 sm:text-5xl">
            The Creator Game Field Guide
          </h1>
          <p className="text-xl text-muted-foreground">
            A quick reference to the games creators actually play — and how they break
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-16 space-y-6 text-lg leading-8 text-foreground">
          <p>
            Most creators aren't failing because of effort or talent.
            <br />
            They're failing because they're playing one game with the rules of another.
          </p>
          <p>
            After analyzing podcasts, newsletters, and media businesses across tech, culture, and education, a small number of repeatable creator games emerge.
          </p>
          <p className="font-semibold">Each game:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Creates value in a different way</li>
            <li>Rewards different behaviors</li>
            <li>Breaks in predictable ways</li>
          </ul>
          <p className="pt-4">
            This page is a quick guide to those games — so you can recognize your own.
          </p>
        </section>

        {/* G1 */}
        <section className="mb-16 p-8 border rounded-lg bg-card">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            G1 — Identity / Canon Game
          </h2>
          <p className="text-xl text-muted-foreground mb-6 italic">
            "Who should people become — and who should they study?"
          </p>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">What this game is</h3>
              <p>
                The Identity / Canon game builds lineage.
                <br />
                It tells people who matters, what counts, and what tradition they belong to.
              </p>
              <p className="mt-3">Creators in this game curate:</p>
              <ul className="space-y-2 pl-6 list-disc mt-2">
                <li>Heroes</li>
                <li>Texts</li>
                <li>Archetypes</li>
                <li>Norms</li>
              </ul>
              <p className="mt-3">They don't just teach ideas — they shape taste and belonging.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How value is created</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Authority through curation</li>
                <li>Trust through consistency</li>
                <li>Status through alignment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Common failure mode</h3>
              <p>Trying to "teach tactics" or chase novelty breaks the canon.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Examples</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li><strong>David Senra (Founders)</strong> — Founder archetypes as a moral lineage</li>
                <li><strong>Ryan Holiday</strong> — Stoicism as a modern operating system</li>
                <li><strong>Brent Hull (Passion for Craft)</strong> — Traditional architecture and mastery</li>
              </ul>
            </div>
          </div>
        </section>

        {/* G2 */}
        <section className="mb-16 p-8 border rounded-lg bg-card">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            G2 — Idea / Play Mining Game
          </h2>
          <p className="text-xl text-muted-foreground mb-6 italic">
            "What can we extract and apply right now?"
          </p>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">What this game is</h3>
              <p>
                The Idea Mining game looks at history, stories, and systems as a resource.
              </p>
              <p className="mt-3">Creators here specialize in:</p>
              <ul className="space-y-2 pl-6 list-disc mt-2">
                <li>Extracting reusable insights</li>
                <li>Translating them into modern plays</li>
                <li>Making the abstract actionable</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How value is created</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Compression (long → short)</li>
                <li>Transfer (then → now)</li>
                <li>Application (theory → move)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Common failure mode</h3>
              <p>Drifting into motivation or vague inspiration instead of concrete plays.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Examples</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li><strong>My First Million</strong> — Historical and contemporary business plays</li>
                <li><strong>Early Founders episodes</strong> — Tactical extraction from biographies</li>
                <li><strong>Business breakdown newsletters</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* G3 */}
        <section className="mb-16 p-8 border rounded-lg bg-card">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            G3 — Model / Understanding Game
          </h2>
          <p className="text-xl text-muted-foreground mb-6 italic">
            "How does this actually work?"
          </p>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">What this game is</h3>
              <p>The Model game builds mental frameworks.</p>
              <p className="mt-3">Creators here are obsessed with:</p>
              <ul className="space-y-2 pl-6 list-disc mt-2">
                <li>Structure</li>
                <li>Causality</li>
                <li>Systems</li>
                <li>First principles</li>
              </ul>
              <p className="mt-3">Entertainment is secondary to clarity.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How value is created</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Reducing confusion</li>
                <li>Creating shared language</li>
                <li>Enabling better reasoning</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Common failure mode</h3>
              <p>Over-teaching or drifting into performative intelligence instead of usable models.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Examples</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li><strong>Tyler Cowen (Conversations with Tyler)</strong> — Guest world-model decoding</li>
                <li><strong>Dwarkesh Patel</strong> — Civilizational and technical models</li>
                <li><strong>Shane Parrish (Farnam Street)</strong> — Mental models for decision-making</li>
              </ul>
            </div>
          </div>
        </section>

        {/* G4 */}
        <section className="mb-16 p-8 border rounded-lg bg-card">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            G4 — Performance / Coaching Game
          </h2>
          <p className="text-xl text-muted-foreground mb-6 italic">
            "How do you get better results?"
          </p>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">What this game is</h3>
              <p>This game is about execution under constraint.</p>
              <p className="mt-3">Creators focus on:</p>
              <ul className="space-y-2 pl-6 list-disc mt-2">
                <li>Skill development</li>
                <li>Feedback loops</li>
                <li>Practice systems</li>
              </ul>
              <p className="mt-3">The promise is improvement, not insight alone.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How value is created</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Measurable outcomes</li>
                <li>Personal transformation</li>
                <li>Repeatable improvement</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Common failure mode</h3>
              <p>Sliding into generic advice or motivation without accountability.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Examples</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>High-performance coaching creators</li>
                <li>Skill-focused YouTubers</li>
                <li>Applied productivity systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* G5 */}
        <section className="mb-16 p-8 border rounded-lg bg-card">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            G5 — Meaning / Sensemaking Game
          </h2>
          <p className="text-xl text-muted-foreground mb-6 italic">
            "What does this mean for how we live?"
          </p>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">What this game is</h3>
              <p>The Meaning game helps people make sense of:</p>
              <ul className="space-y-2 pl-6 list-disc mt-2">
                <li>Change</li>
                <li>Uncertainty</li>
                <li>Identity</li>
                <li>Values</li>
              </ul>
              <p className="mt-3">This game isn't about winning — it's about orientation.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How value is created</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Emotional clarity</li>
                <li>Narrative coherence</li>
                <li>Shared reflection</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Common failure mode</h3>
              <p>Becoming therapeutic or vague instead of grounded and rigorous.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Examples</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li><strong>Russ Roberts (EconTalk, later years)</strong> — Economics → human meaning</li>
                <li>Long-form reflective writers</li>
                <li>Cultural and philosophical podcasters</li>
              </ul>
            </div>
          </div>
        </section>

        {/* G6 */}
        <section className="mb-16 p-8 border rounded-lg bg-card">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl">
            G6 — Network / Coordination Game
          </h2>
          <p className="text-xl text-muted-foreground mb-6 italic">
            "Who should be connected — and how?"
          </p>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">What this game is</h3>
              <p>This game creates value by orchestrating people, not ideas.</p>
              <p className="mt-3">Creators act as:</p>
              <ul className="space-y-2 pl-6 list-disc mt-2">
                <li>Hubs</li>
                <li>Matchmakers</li>
                <li>Conveners</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How value is created</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Trust transfer</li>
                <li>Access</li>
                <li>Coordination leverage</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Common failure mode</h3>
              <p>Confusing networking with depth or substituting status for substance.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Examples</h3>
              <ul className="space-y-2 pl-6 list-disc">
                <li>Community-first creators</li>
                <li>Invite-only groups and salons</li>
                <li>Platform builders and curators</li>
              </ul>
            </div>
          </div>
        </section>

        {/* The Most Common Mistake */}
        <section className="mb-16 p-8 border-l-4 border-primary bg-primary/5 rounded-r-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">The Most Common Mistake</h2>
          <div className="space-y-4 text-lg leading-8 text-foreground">
            <p>
              Most creators aren't playing the wrong game.
              <br />
              They're playing multiple games at once — unintentionally.
            </p>
            <p className="font-semibold">That creates:</p>
            <ul className="space-y-2 pl-6 list-disc">
              <li>Confusing content</li>
              <li>Weak leverage</li>
              <li>Systems that drift as soon as you delegate or automate</li>
            </ul>
          </div>
        </section>

        {/* What This Page Is For */}
        <section className="mb-16 space-y-6 text-lg leading-8 text-foreground">
          <h2 className="text-2xl font-bold text-foreground">What This Page Is For</h2>
          <p>This guide is meant to help you:</p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>Recognize your primary game</li>
            <li>Understand why certain advice doesn't work for you</li>
            <li>See why scaling often breaks alignment</li>
          </ul>
          <p className="pt-4">
            If you want a diagnostic of which game you're actually playing — and guardrails to keep your systems aligned — that's what the Game Audit is for.
          </p>
          <p className="pt-4 text-xl font-semibold">
            But this page should already make one thing clear:
          </p>
          <div className="p-6 border rounded-lg bg-card text-xl font-semibold text-foreground">
            👉 Once you know the game, everything else simplifies.
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-8 border-t">
          <Link
            href="/quiz"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xl hover:bg-primary/90 transition-colors mb-4"
          >
            👉 Find Your Game
          </Link>
          <p className="text-sm text-muted-foreground">
            Or <Link href="/" className="text-primary hover:underline">return to home</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
