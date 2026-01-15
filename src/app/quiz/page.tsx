"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    section: "A — CORE INTENT",
    sectionTitle: "What you're really optimizing for",
    items: [
      {
        id: "q1",
        question: "When an episode goes well, what feels most satisfying?",
        options: [
          { value: "A", label: "Listeners can do something concrete immediately" },
          { value: "B", label: "Listeners say they now understand something complex" },
          { value: "C", label: "Listeners feel emotionally aligned or personally seen" },
          { value: "D", label: "The episode strengthens your long-term body of work" },
          { value: "E", label: "The guest relationship deepens or expands your network" },
        ],
      },
      {
        id: "q2",
        question: "If forced to choose, your show is primarily:",
        options: [
          { value: "A", label: "A tool for better decisions or actions" },
          { value: "B", label: "A way to map reality more accurately" },
          { value: "C", label: "A mirror for identity, values, or belonging" },
          { value: "D", label: "A growing archive or canon" },
          { value: "E", label: "A relationship engine" },
        ],
      },
      {
        id: "q3",
        question: "What do you most want listeners to say about your work?",
        options: [
          { value: "A", label: '"This changed how I operate"' },
          { value: "B", label: '"This helped me understand the system"' },
          { value: "C", label: '"This made me feel less alone / more grounded"' },
          { value: "D", label: '"This is essential reference material"' },
          { value: "E", label: '"This connects me to interesting people"' },
        ],
      },
    ],
  },
  {
    section: "B — STRUCTURE & EPISODE DESIGN",
    sectionTitle: "Revealed behavior",
    items: [
      {
        id: "q4",
        question: "You feel best when an episode:",
        options: [
          { value: "A", label: "Ends with clear takeaways or frameworks" },
          { value: "B", label: "Builds a model step-by-step" },
          { value: "C", label: "Moves naturally through personal stories" },
          { value: "D", label: "Fits cleanly into a larger series or theme" },
          { value: "E", label: "Creates follow-on conversations" },
        ],
      },
      {
        id: "q5",
        question: "When editing (or wishing you could edit), you most want to remove:",
        options: [
          { value: "A", label: "Tangents that don't lead to action" },
          { value: "B", label: "Loose or sloppy thinking" },
          { value: "C", label: "Moments that feel emotionally flat" },
          { value: "D", label: "Redundancy with past episodes" },
          { value: "E", label: "Anything that weakens rapport" },
        ],
      },
      {
        id: "q6",
        question: "You are most comfortable letting an episode be:",
        options: [
          { value: "A", label: "Tight and efficient" },
          { value: "B", label: "Dense and demanding" },
          { value: "C", label: "Meandering but human" },
          { value: "D", label: "Long if it's comprehensive" },
          { value: "E", label: "Open-ended if it builds trust" },
        ],
      },
    ],
  },
  {
    section: "C — FAILURE PAIN",
    sectionTitle: "Where things break",
    items: [
      {
        id: "q7",
        question: "The feedback that bothers you most:",
        options: [
          { value: "A", label: '"Interesting, but what do I do with this?"' },
          { value: "B", label: '"This feels smart but confusing"' },
          { value: "C", label: '"I couldn\'t connect to it emotionally"' },
          { value: "D", label: '"I\'m not sure how this fits with your other work"' },
          { value: "E", label: '"It felt transactional or surface-level"' },
        ],
      },
      {
        id: "q8",
        question: "When growth stalls, you secretly worry that:",
        options: [
          { value: "A", label: "You're not delivering enough practical value" },
          { value: "B", label: "You're overcomplicating things" },
          { value: "C", label: "You're not being authentic enough" },
          { value: "D", label: "Your work lacks a clear throughline" },
          { value: "E", label: "You're not leveraging relationships well" },
        ],
      },
      {
        id: "q9",
        question: "Your biggest frustration lately:",
        options: [
          { value: "A", label: "Advice doesn't compound" },
          { value: "B", label: "Ideas aren't landing clearly" },
          { value: "C", label: "Resonance feels inconsistent" },
          { value: "D", label: "The archive feels messy or underutilized" },
          { value: "E", label: "The network isn't activating" },
        ],
      },
    ],
  },
  {
    section: "D — TIEBREAKER",
    sectionTitle: "Secondary Game Pressure",
    items: [
      {
        id: "q10",
        question: "If someone misunderstood your work, you'd correct them by saying:",
        options: [
          { value: "A", label: '"No — this is about results"' },
          { value: "B", label: '"No — this is about understanding"' },
          { value: "C", label: '"No — this is about values / identity"' },
          { value: "D", label: '"No — this is about the long game"' },
          { value: "E", label: '"No — this is about relationships"' },
        ],
      },
      {
        id: "q11",
        question: "You are most jealous of creators who:",
        options: [
          { value: "A", label: "Turn insight into leverage" },
          { value: "B", label: "Explain hard things cleanly" },
          { value: "C", label: "Build cult-like loyalty" },
          { value: "D", label: "Build timeless bodies of work" },
          { value: "E", label: "Sit at the center of networks" },
        ],
      },
      {
        id: "q12",
        question: "If forced to simplify your role:",
        options: [
          { value: "A", label: "Coach" },
          { value: "B", label: "Interpreter" },
          { value: "C", label: "Guide" },
          { value: "D", label: "Archivist" },
          { value: "E", label: "Connector" },
        ],
      },
    ],
  },
];

const gameMapping: Record<string, string> = {
  A: "G1",
  B: "G3",
  C: "G5",
  D: "G4",
  E: "G6",
};

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateResult = () => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    const sectionCAnswers: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    // Count all answers
    Object.values(answers).forEach((answer) => {
      if (answer) counts[answer]++;
    });

    // Weight Section C more heavily
    questions[2].items.forEach((item) => {
      const answer = answers[item.id];
      if (answer) {
        counts[answer] += 0.5; // Extra weight
        sectionCAnswers[answer]++;
      }
    });

    // Find primary and secondary
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0][0];
    const secondary = sorted[1][0];

    const primaryGame = gameMapping[primary];
    const secondaryGame = gameMapping[secondary];

    return { primaryGame, secondaryGame };
  };

  const handleSubmit = () => {
    const allAnswered = questions.every((section) =>
      section.items.every((item) => answers[item.id])
    );

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const result = calculateResult();
    router.push(`/quiz/result?game=${result.primaryGame}&secondary=${result.secondaryGame}`);
  };

  const currentSectionData = questions[currentSection];
  const isLastSection = currentSection === questions.length - 1;
  const isFirstSection = currentSection === 0;

  const currentSectionComplete = currentSectionData.items.every(
    (item) => answers[item.id]
  );

  const nextSection = () => {
    if (currentSectionComplete && !isLastSection) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevSection = () => {
    if (!isFirstSection) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Game Identification Diagnostic
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Answer quickly. Choose the option that feels most true, not what you aspire to.
            <br />
            <strong className="text-foreground">This is about how you actually operate today.</strong>
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Section {currentSection + 1} of {questions.length}</span>
            <span>
              {questions.reduce((acc, section) => 
                acc + section.items.filter((item) => answers[item.id]).length, 0
              )} / {questions.reduce((acc, section) => acc + section.items.length, 0)} answered
            </span>
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentSectionData.section}
            </h2>
            <p className="text-muted-foreground mb-8">{currentSectionData.sectionTitle}</p>

            {currentSectionData.items.map((item) => (
              <div key={item.id} className="mb-10">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {item.question}
                </h3>
                <div className="space-y-3">
                  {item.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[item.id] === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={item.id}
                        value={option.value}
                        checked={answers[item.id] === option.value}
                        onChange={() => handleAnswer(item.id, option.value)}
                        className="mt-1 mr-3 h-4 w-4 text-primary"
                      />
                      <span className="flex-1 text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-8 border-t">
            <button
              onClick={prevSection}
              disabled={isFirstSection}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isFirstSection
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Previous
            </button>

            {isLastSection ? (
              <button
                onClick={handleSubmit}
                disabled={!currentSectionComplete}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  currentSectionComplete
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                See Your Result
              </button>
            ) : (
              <button
                onClick={nextSection}
                disabled={!currentSectionComplete}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentSectionComplete
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Next Section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
