import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 sm:text-5xl">
            You're In. Here's What Happens Next.
          </h1>
          <p className="text-xl text-muted-foreground">
            You've secured a Game Audit slot.
          </p>
        </div>

        {/* Intro */}
        <div className="mb-12 space-y-4 text-lg leading-8 text-foreground">
          <p>
            This audit is a diagnostic, not a process — so what happens next is intentionally simple.
          </p>
        </div>

        {/* Step 1 */}
        <section className="mb-12">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              1
            </span>
            <h2 className="text-2xl font-bold text-foreground">Intake (5–10 minutes)</h2>
          </div>
          <div className="ml-14 space-y-4 text-lg leading-8 text-foreground">
            <p>
              Within the next few minutes, you'll receive a short intake form by email.
            </p>
            <p>You'll be asked to provide:</p>
            <ul className="space-y-2 pl-6 list-disc">
              <li>Primary content or media links (podcast, writing, video, etc.)</li>
              <li>Any specific episode, artifact, or body of work you want evaluated</li>
              <li>Optional context on what feels off or constrained right now</li>
            </ul>
            <p className="font-semibold">
              No long narratives required.
              <br />
              Clarity &gt; completeness.
            </p>
          </div>
        </section>

        {/* Step 2 */}
        <section className="mb-12">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              2
            </span>
            <h2 className="text-2xl font-bold text-foreground">Analysis Window</h2>
          </div>
          <div className="ml-14 space-y-4 text-lg leading-8 text-foreground">
            <p>Once your intake is submitted, the audit begins.</p>
            <p className="font-semibold">During this phase:</p>
            <ul className="space-y-2 pl-6 list-disc">
              <li>Your content is analyzed for actual game signals, not stated intent</li>
              <li>Primary and secondary games are identified</li>
              <li>Structural conflicts and failure modes are mapped</li>
              <li>Constraints and invariants are defined</li>
            </ul>
            <p className="pt-4">
              You will not be asked follow-up questions unless something is genuinely ambiguous.
            </p>
            <p className="font-semibold">
              Silence here is a feature, not a bug.
            </p>
          </div>
        </section>

        {/* Step 3 */}
        <section className="mb-12">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              3
            </span>
            <h2 className="text-2xl font-bold text-foreground">Delivery (7–10 days)</h2>
          </div>
          <div className="ml-14 space-y-4 text-lg leading-8 text-foreground">
            <p>
              You'll receive a written Game Audit delivered directly to your inbox.
            </p>
            <p className="font-semibold">The audit will:</p>
            <ul className="space-y-2 pl-6 list-disc">
              <li>Name the game you're playing (and the ones you're unintentionally triggering)</li>
              <li>Explain where leverage is leaking</li>
              <li>Clarify what must remain fixed for the game to work</li>
              <li>Identify what to stop, simplify, or ignore</li>
            </ul>
            <p className="pt-4 font-semibold">
              No call is required to "walk you through it."
              <br />
              The document stands on its own.
            </p>
          </div>
        </section>

        {/* What This Is (and Isn't) */}
        <section className="mb-12 p-8 border rounded-lg bg-card">
          <h2 className="text-2xl font-bold text-foreground mb-6">What This Is (and Isn't)</h2>
          <div className="space-y-6 text-lg leading-8">
            <div>
              <p className="font-semibold text-foreground mb-3">This is:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>Structural clarity</li>
                <li>Strategic constraint</li>
                <li>A lens you can reuse</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-3">This is not:</p>
              <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                <li>Coaching</li>
                <li>A content plan</li>
                <li>A list of tactics</li>
                <li>Ongoing support</li>
              </ul>
            </div>
            <p className="pt-4 text-foreground">
              If additional work makes sense after the audit, it will be obvious — and optional.
            </p>
          </div>
        </section>

        {/* Final Note */}
        <section className="mb-12 p-8 border-l-4 border-primary bg-primary/5 rounded-r-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">A Final Note</h2>
          <div className="space-y-4 text-lg leading-8 text-foreground">
            <p>
              The goal of this audit is not to make you do more.
            </p>
            <p className="font-semibold">
              It's to make it clear what game you're already in
              <br />
              — and whether you're actually playing it well.
            </p>
            <p className="pt-4">
              You'll receive the intake shortly.
              <br />
              That's all you need to do for now.
            </p>
          </div>
        </section>

        {/* Optional CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
}
