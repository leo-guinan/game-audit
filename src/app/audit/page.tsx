import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 py-24 sm:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            The Game Audit
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
            For podcast hosts who want their content to compound—not drift
          </p>
          <div className="mt-10">
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              Take the Game Identification Diagnostic
            </Link>
          </div>
        </div>
      </section>

      {/* Opening Hook */}
      <section className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p className="font-semibold">Your podcast is working.</p>
          <p>People listen. Episodes go out. The show is "good."</p>
          <p className="text-muted-foreground">But something feels off.</p>
          <ul className="space-y-3 pl-6 list-disc text-muted-foreground">
            <li>It's harder than it should be to explain what the show really does</li>
            <li>Episodes vary in quality even when effort is consistent</li>
            <li>Clips don't travel the way they should</li>
            <li>Growth feels flat or noisy instead of cumulative</li>
          </ul>
          <p className="pt-4 font-semibold">
            This isn't a production problem.
            <br />
            <span className="text-foreground">It's a game clarity problem.</span>
          </p>
        </div>
      </section>

      {/* The Real Problem */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          The Real Problem
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-8 text-foreground">
          <p>
            Every successful podcast plays a <strong>specific game</strong>.
          </p>
          <p className="text-muted-foreground">
            Not a format.
            <br />
            Not a niche.
            <br />
            <strong className="text-foreground">A game</strong>—with constraints, incentives, and win conditions.
          </p>
          <p>Most hosts never name the game they're playing.</p>
          <p className="text-muted-foreground">They just feel it… until drift sets in.</p>
          <div className="mt-8 space-y-4">
            <p className="font-semibold">When the game is implicit:</p>
            <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
              <li>content decisions get fuzzy</li>
              <li>episodes compete with each other</li>
              <li>authority leaks slowly over time</li>
            </ul>
          </div>
          <p className="pt-4 text-xl font-semibold">
            The Game Audit exists to make the game explicit.
          </p>
        </div>
      </section>

      {/* What the Game Audit Is */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What the Game Audit Is
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-8 text-foreground">
          <p>
            The Game Audit is a done-for-you strategic analysis of your podcast that identifies:
          </p>
          <ul className="space-y-3 pl-6 list-disc">
            <li>the content game your show is actually playing</li>
            <li>the rules and constraints that make that game work</li>
            <li>the failure modes that quietly erode authority</li>
          </ul>
          <p>
            You receive a clear <strong>Game Contract</strong>—a structural blueprint your content can reliably adhere to.
          </p>
          <p className="text-xl font-semibold">
            This is upstream of growth, clips, and monetization.
            <br />
            If the game is right, everything else compounds.
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Who This Is For
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-8 text-foreground">
          <p>The Game Audit is designed for:</p>
          <ul className="space-y-3 pl-6 list-disc">
            <li>Podcast hosts with an existing audience</li>
            <li>Shows publishing consistently but feeling "hard to describe"</li>
            <li>Founders who care about long-term authority, not spikes</li>
            <li>Hosts who sense drift but can't quite name it</li>
          </ul>
          <p className="pt-4 text-muted-foreground">
            If you're still figuring out how to start a podcast, this is not for you.
            <br />
            If you already publish—and want your work to matter more over time—keep reading.
          </p>
          <div className="mt-8 text-center">
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
            >
              Discover Your Game →
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What You Get
        </h2>
        <div className="mt-12 space-y-16">
          {/* 1. Game Identification */}
          <div>
            <div className="flex items-baseline gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                1
              </span>
              <h3 className="text-2xl font-bold text-foreground">Game Identification</h3>
            </div>
            <div className="mt-6 ml-14 space-y-4 text-lg leading-8">
              <p>A clear declaration of:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>your Primary Game</li>
                <li>any Secondary Games</li>
                <li>why these games fit—or conflict</li>
              </ul>
              <p className="pt-2">
                This answers: <em className="text-muted-foreground">"What is this show actually optimizing for?"</em>
              </p>
            </div>
          </div>

          {/* 2. The Game Contract */}
          <div>
            <div className="flex items-baseline gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                2
              </span>
              <h3 className="text-2xl font-bold text-foreground">The Game Contract</h3>
            </div>
            <div className="mt-6 ml-14 space-y-4 text-lg leading-8">
              <p>A written contract defining:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>allowed moves</li>
                <li>forbidden moves</li>
                <li>structural constraints</li>
                <li>alignment vs drift signals</li>
              </ul>
              <p className="pt-2">This becomes a decision filter for:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>episode selection</li>
                <li>guest choice</li>
                <li>editing</li>
                <li>clipping</li>
                <li>distribution</li>
              </ul>
              <p className="pt-2 font-semibold">If it violates the contract, you don't do it.</p>
            </div>
          </div>

          {/* 3. Episode & Structure Analysis */}
          <div>
            <div className="flex items-baseline gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                3
              </span>
              <h3 className="text-2xl font-bold text-foreground">Episode & Structure Analysis</h3>
            </div>
            <div className="mt-6 ml-14 space-y-4 text-lg leading-8">
              <p>A breakdown of:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>how your episodes currently work</li>
                <li>where the game is reinforced</li>
                <li>where it's being undermined</li>
              </ul>
              <p className="pt-2">You'll see exactly where coherence is being lost.</p>
            </div>
          </div>

          {/* 4. Founder / Guest Game Mapping */}
          <div>
            <div className="flex items-baseline gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                4
              </span>
              <h3 className="text-2xl font-bold text-foreground">Founder / Guest Game Mapping</h3>
              <span className="text-sm font-normal text-muted-foreground">(when applicable)</span>
            </div>
            <div className="mt-6 ml-14 space-y-4 text-lg leading-8">
              <p>For interview- or biography-driven shows:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>the game your subject is playing</li>
                <li>how it interacts with your game</li>
                <li>where leverage is gained—or wasted</li>
              </ul>
              <p className="pt-2">This is where most interview shows unknowingly leak value.</p>
            </div>
          </div>

          {/* 5. Aligned Sample Assets */}
          <div>
            <div className="flex items-baseline gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                5
              </span>
              <h3 className="text-2xl font-bold text-foreground">Aligned Sample Assets</h3>
            </div>
            <div className="mt-6 ml-14 space-y-4 text-lg leading-8">
              <p>
                You'll receive example content outputs—such as a clip framing, outline, or written asset—that demonstrate correct alignment in practice.
              </p>
              <p className="font-semibold">
                Not templates.
                <br />
                Proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What This Is Not */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What This Is Not
        </h2>
        <div className="mt-8 space-y-4 text-lg leading-8 text-foreground">
          <ul className="space-y-3 pl-6 list-disc text-muted-foreground">
            <li>❌ Not editing</li>
            <li>❌ Not content repurposing</li>
            <li>❌ Not growth hacking</li>
            <li>❌ Not a coaching program</li>
          </ul>
          <p className="pt-4 text-xl font-semibold">
            This is strategic infrastructure.
            <br />
            <span className="text-muted-foreground">If the game is wrong, no tactic fixes it.</span>
          </p>
        </div>
      </section>

      {/* The Outcome */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          The Outcome
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-8 text-foreground">
          <p>After the Game Audit, you will be able to:</p>
          <ul className="space-y-3 pl-6 list-disc">
            <li>describe your show in one sentence without hand-waving</li>
            <li>make faster, clearer content decisions</li>
            <li>prevent long-term authority dilution</li>
            <li>create assets that travel without losing meaning</li>
            <li>let your podcast compound instead of reset</li>
          </ul>
        </div>
      </section>

      {/* Engagement Details */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Engagement Details
        </h2>
        <div className="mt-8 space-y-4 text-lg leading-8 text-foreground">
          <p>
            <strong>Format:</strong> Done-for-you audit + review call
          </p>
          <p>
            <strong>Timeline:</strong> ~2 weeks
          </p>
          <p>
            <strong>Investment:</strong> $4,000
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="mx-auto mt-24 max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Guarantee
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-8 text-foreground">
          <p>
            If the audit does not produce:
          </p>
          <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
            <li>a clearly articulated game</li>
            <li>explicit constraints</li>
            <li>and demonstrably aligned sample assets</li>
          </ul>
          <p className="pt-4 text-xl font-semibold">
            the engagement is fully refundable.
          </p>
          <p className="text-lg">
            No risk.
            <br />
            No games.
          </p>
        </div>
      </section>

      {/* Final Thought */}
      <section className="mx-auto mt-24 max-w-3xl px-6 pb-24 sm:px-8">
        <div className="space-y-6 text-lg leading-8 text-foreground">
          <p>
            Most podcasts fail slowly—not loudly.
          </p>
          <p>
            The Game Audit is for hosts who want to name the game early, lock it in, and build something that holds up over years, not seasons.
          </p>
          <p className="pt-4 text-xl font-semibold">
            If you want your content to compound, this is the work.
          </p>
        </div>
      </section>
    </div>
  );
}
