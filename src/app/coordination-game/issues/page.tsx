import Link from "next/link";
import Header from "@/components/header";

export default function CoordinationGameIssuesPage() {
  const issues = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-6 sm:px-8 py-16">
        <Link
          href="/coordination-game"
          className="text-sm font-mono text-muted-foreground hover:text-primary mb-8 inline-block"
        >
          ← The Coordination Game
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          All Issues
        </h1>
        <p className="text-muted-foreground mb-12">
          Archive of newsletter issues. New issues published every Monday.
        </p>
        <div className="space-y-8">
          {issues.map(({ issue, title, desc }) => (
            <article
              key={issue}
              className="p-6 border border-border bg-muted/30 hover:border-primary/40 transition-colors"
            >
              <div className="font-mono text-sm text-primary mb-2">
                Issue #{issue}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/coordination-game"
            className="button secondary inline-block"
          >
            Subscribe to The Coordination Game
          </Link>
        </div>
      </main>
    </div>
  );
}
