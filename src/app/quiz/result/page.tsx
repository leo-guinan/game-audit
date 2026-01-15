"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const gameResults: Record<string, any> = {
  G1: {
    headline: "You're playing the Identity Game.",
    subheadline: "Your work is about lineage, standards, and \"who this is for.\"",
    whatThisMeans: {
      main: "You are not primarily creating content.\nYou are curating a canon — defining what counts, what matters, and who belongs inside it.",
      peopleComeFor: [
        "Taste",
        "Judgment",
        "Standards",
        "Signal over noise",
      ],
      whenWorks: "When this game works, you become a reference point.",
    },
    failureMode: {
      title: "You're not being explicit enough.",
      symptoms: [
        "People like your work but don't repeat it",
        "Your audience grows slowly but loyally",
        "Newcomers don't \"get it\" right away",
      ],
      explanation: "You're assuming the canon is obvious.\nIt isn't.",
    },
    whatWontFix: [
      "More posting",
      "Better hooks",
      "Chasing reach",
      "Adding \"practical tips\" to seem accessible",
    ],
    whatWontFixNote: "Those dilute the game you're already winning.",
    whatWillFix: [
      "Sharpening your canon boundaries",
      "Making inclusion/exclusion explicit",
      "Structuring episodes/content around selection, not output",
      "Turning taste into teachable structure",
    ],
    auditName: "Canon Clarity Audit",
    auditDescription: "A focused audit of your work to identify:",
    auditPoints: [
      "What canon you're actually constructing",
      "Where it's leaking signal",
      "How to make your standards legible without dumbing them down",
    ],
    auditBestIf: "You want authority, not virality.",
  },
  G2: {
    headline: "You're playing the Idea Mining Game.",
    subheadline: "Your edge is extracting usable insight from other people's lives and work.",
    whatThisMeans: {
      main: "Your audience isn't here for you —\nthey're here for what you can pull out of the world.",
      youWinBy: [
        "Finding plays others miss",
        "Translating history into action",
        "Making past success feel usable now",
      ],
      whenWorks: "When this works, your work feels endlessly valuable.",
    },
    failureMode: {
      title: "You're extracting without compressing.",
      symptoms: [
        "Episodes feel long but fuzzy",
        "Listeners enjoy it but don't apply it",
        "Great material, weak takeaways",
      ],
      explanation: "You're mining — but not refining.",
    },
    whatWontFix: [
      "More research",
      "More guests",
      "Longer episodes",
      "Better questions alone",
    ],
    whatWontFixNote: "Depth without compression creates fatigue.",
    whatWillFix: [
      "Explicit play frameworks",
      "Repeatable extraction patterns",
      "Clear \"this is the move\" moments",
      "Structural summaries that travel",
    ],
    auditName: "Idea Extraction Audit",
    auditDescription: "A deep dive into how effectively your work:",
    auditPoints: [
      "Pulls actionable plays",
      "Signals value density",
      "Teaches listeners how to think, not just what to admire",
    ],
    auditBestIf: "People say \"this was great\" — but nothing changes.",
  },
  G3: {
    headline: "You're playing the Understanding Game.",
    subheadline: "Your goal is to reduce confusion, not maximize engagement.",
    whatThisMeans: {
      main: "You are building mental models —\nways of seeing the world that feel clarifying and stable.",
      audienceComesFor: [
        "Sense-making",
        "Precision",
        "Fewer, better ideas",
      ],
      whenWorks: "When this works, your work becomes sticky and referential.",
    },
    failureMode: {
      title: "You're too abstract too fast.",
      symptoms: [
        "People respect your work but don't share it",
        "You attract peers, not learners",
        "Listeners get lost before payoff",
      ],
      explanation: "You're building models — but not ladders.",
    },
    whatWontFix: [
      "Simplifying the ideas themselves",
      "Adding more examples randomly",
      "Chasing controversy",
    ],
    whatWontFixNote: "The issue isn't intelligence. It's sequencing.",
    whatWillFix: [
      "Better entry points",
      "Progressive scaffolding",
      "Explicit model boundaries",
      "Clear \"before vs after\" framing",
    ],
    auditName: "Model Clarity Audit",
    auditDescription: "A structural review focused on:",
    auditPoints: [
      "Where people fall off",
      "How models are introduced",
      "Whether understanding actually transfers",
    ],
    auditBestIf: "People say \"this is smart\" but still feel unsure what changed.",
  },
  G4: {
    headline: "You're playing the Performance Game.",
    subheadline: "Your work exists to change behavior, not beliefs.",
    whatThisMeans: {
      main: "Your value is outcomes.",
      audienceWants: [
        "Results",
        "Direction",
        "Feedback",
        "Accountability",
      ],
      whenWorks: "When this game works, people credit you with real change.",
    },
    failureMode: {
      title: "You're not constraining enough.",
      symptoms: [
        "Advice is good but overwhelming",
        "People consume without acting",
        "Wins are inconsistent",
      ],
      explanation: "Freedom feels generous — but it slows execution.",
    },
    whatWontFix: [
      "More motivation",
      "More content",
      "More optionality",
    ],
    whatWontFixNote: "Performance improves through constraint.",
    whatWillFix: [
      "Clear standards",
      "Narrow definitions of success",
      "Fewer paths, not more",
      "Explicit failure conditions",
    ],
    auditName: "Performance Alignment Audit",
    auditDescription: "A practical audit designed to:",
    auditPoints: [
      "Identify execution bottlenecks",
      "Tighten your coaching loop",
      "Align advice with achievable outcomes",
    ],
    auditBestIf: "People love your guidance but stall anyway.",
  },
  G5: {
    headline: "You're playing the Meaning Game.",
    subheadline: "Your work helps people make sense of themselves, not just the world.",
    whatThisMeans: {
      main: "You are creating psychological safety and orientation.",
      audienceComesFor: [
        "Validation",
        "Language for experience",
        "Relief from confusion or shame",
      ],
      whenWorks: "When this works, people feel seen.",
    },
    failureMode: {
      title: "You're avoiding resolution.",
      symptoms: [
        "Insight without integration",
        "Comfort without movement",
        "Listeners feel better — but stuck",
      ],
      explanation: "Meaning without direction becomes a loop.",
    },
    whatWontFix: [
      "Deeper introspection",
      "More vulnerability",
      "More empathy alone",
    ],
    whatWontFixNote: "Care needs containment.",
    whatWillFix: [
      "Clear arcs",
      "Transition points",
      "Identity movement",
      "Explicit \"what now\" moments",
    ],
    auditName: "Meaning-to-Motion Audit",
    auditDescription: "A careful, respectful audit that examines:",
    auditPoints: [
      "Whether your work leads somewhere",
      "Where reflection should turn into action",
      "How to preserve care while enabling change",
    ],
    auditBestIf: "Your audience feels understood — but not transformed.",
  },
  G6: {
    headline: "You're playing the Network Game.",
    subheadline: "Your real product is connection.",
    whatThisMeans: {
      main: "Your work succeeds when:",
      successWhen: [
        "People find each other",
        "Conversations propagate",
        "Trust compounds",
      ],
      additional: "You are coordinating energy, not just publishing content.",
    },
    failureMode: {
      title: "You're not designing for emergence.",
      symptoms: [
        "Strong audience, weak interaction",
        "Great guests, shallow network effects",
        "Conversations don't persist",
      ],
      explanation: "Networks don't form accidentally.",
    },
    whatWontFix: [
      "Bigger audiences",
      "More platforms",
      "More content",
    ],
    whatWontFixNote: "Scale without structure creates noise.",
    whatWillFix: [
      "Clear roles",
      "Shared language",
      "Repeatable interaction patterns",
      "Designed surfaces for connection",
    ],
    auditName: "Network Leverage Audit",
    auditDescription: "A systems-level audit focused on:",
    auditPoints: [
      "How value moves through your ecosystem",
      "Where coordination breaks down",
      "How to turn audience into infrastructure",
    ],
    auditBestIf: "You want compounding effects, not just reach.",
  },
};

function ResultContent() {
  const searchParams = useSearchParams();
  const game = searchParams.get("game") || "G1";
  const secondary = searchParams.get("secondary") || "";

  const result = gameResults[game];
  const secondaryResult = secondary ? gameResults[secondary] : null;

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Result not found</h1>
          <Link href="/quiz" className="text-primary hover:underline">
            Take the quiz again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        {/* Headline */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 sm:text-5xl">
            {result.headline}
          </h1>
          <p className="text-xl text-muted-foreground">{result.subheadline}</p>
        </div>

        {/* What This Means */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">What This Means</h2>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <p className="whitespace-pre-line">{result.whatThisMeans.main}</p>
            
            {result.whatThisMeans.peopleComeFor && (
              <div>
                <p className="font-semibold mb-3">People come to you for:</p>
                <ul className="space-y-2 pl-6 list-disc">
                  {result.whatThisMeans.peopleComeFor.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.whatThisMeans.youWinBy && (
              <div>
                <p className="font-semibold mb-3">You win by:</p>
                <ul className="space-y-2 pl-6 list-disc">
                  {result.whatThisMeans.youWinBy.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.whatThisMeans.audienceComesFor && (
              <div>
                <p className="font-semibold mb-3">Your audience comes for:</p>
                <ul className="space-y-2 pl-6 list-disc">
                  {result.whatThisMeans.audienceComesFor.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.whatThisMeans.audienceWants && (
              <div>
                <p className="font-semibold mb-3">Your audience wants:</p>
                <ul className="space-y-2 pl-6 list-disc">
                  {result.whatThisMeans.audienceWants.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.whatThisMeans.successWhen && (
              <div>
                <p className="font-semibold mb-3">{result.whatThisMeans.main}</p>
                <ul className="space-y-2 pl-6 list-disc">
                  {result.whatThisMeans.successWhen.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.whatThisMeans.additional && (
              <p className="pt-2">{result.whatThisMeans.additional}</p>
            )}

            {result.whatThisMeans.whenWorks && (
              <p className="pt-4 font-semibold">{result.whatThisMeans.whenWorks}</p>
            )}
          </div>
        </section>

        {/* Failure Mode */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Most Likely Failure Mode</h2>
          <div className="space-y-6 text-lg leading-8 text-foreground">
            <p className="text-xl font-semibold">{result.failureMode.title}</p>
            <div>
              <p className="font-semibold mb-3">Common symptoms:</p>
              <ul className="space-y-2 pl-6 list-disc">
                {result.failureMode.symptoms.map((symptom: string, i: number) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
            </div>
            <p className="pt-4 whitespace-pre-line">{result.failureMode.explanation}</p>
          </div>
        </section>

        {/* What Won't Fix This */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">What Won't Fix This</h2>
          <div className="space-y-4 text-lg leading-8 text-foreground">
            <ul className="space-y-2 pl-6 list-disc">
              {result.whatWontFix.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="pt-4 font-semibold">{result.whatWontFixNote}</p>
          </div>
        </section>

        {/* What Will Fix This */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">What Will Fix This</h2>
          <div className="space-y-4 text-lg leading-8 text-foreground">
            <ul className="space-y-2 pl-6 list-disc">
              {result.whatWillFix.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Conditional CTA */}
        <section className="mt-16 p-8 border-2 border-primary rounded-lg bg-primary/5">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-foreground mb-4">Recommended next step:</p>
              <Link
                href={`/intake?type=${encodeURIComponent(result.auditName)}`}
                className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-xl hover:bg-primary/90 transition-colors"
              >
                👉 Request a {result.auditName}
              </Link>
            </div>
            <div className="space-y-4 text-lg leading-8 text-foreground">
              <p>{result.auditDescription}</p>
              <ul className="space-y-2 pl-6 list-disc">
                {result.auditPoints.map((point: string, i: number) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <p className="pt-4">
                <strong>This audit is best if:</strong> {result.auditBestIf}
              </p>
            </div>
          </div>
        </section>

        {/* Secondary Game (if applicable) */}
        {secondaryResult && (
          <div className="mt-16 p-6 border rounded-lg bg-muted/50">
            <h2 className="text-2xl font-bold text-foreground mb-2">Your Secondary Game</h2>
            <p className="text-lg text-muted-foreground mb-4">{secondaryResult.headline}</p>
            <p className="text-foreground">{secondaryResult.subheadline}</p>
          </div>
        )}

        {/* Secondary CTA */}
        <div className="mt-12 text-center space-y-4">
          <Link
            href="/quiz"
            className="inline-block text-muted-foreground hover:text-foreground transition-colors"
          >
            Retake quiz
          </Link>
          <span className="mx-4 text-muted-foreground">·</span>
          <Link
            href="/"
            className="inline-block text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore other games
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
