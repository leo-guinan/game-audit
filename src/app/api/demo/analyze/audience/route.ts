import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

// Increase timeout for this route (up to 60s on Vercel free plan)
export const maxDuration = 60;

// Fallback reactions
const audienceReactions: Record<string, Record<string, { type: string; reactions: string[] }>> = {
  "bill-gates": {
    G1: { type: "G1-aligned", reactions: ["This reframes what commitment actually costs.", "This changes how I think about founders.", "Gates as archetype: relentless focus."] },
    G2: { type: "G2-misaligned", reactions: ["Cool thread 💯", "Any actionable tips?", "Interesting but what do I do with this?"] },
    G3: { type: "G3-misaligned", reactions: ["This reminds me of hustle culture", "Good story, but how does it actually work?", "Where's the model?"] },
  },
  "jenny": {
    G1: { type: "G1-misaligned", reactions: ["Where's the deeper meaning?", "Seems superficial", "No archetype here"] },
    G2: { type: "G2-aligned", reactions: ["These are the exact moves I needed!", "How do I extract this for my content?", "Clear tactical breakdown."] },
    G3: { type: "G3-misaligned", reactions: ["Good tips but what's the system?", "Tactical without theory", "Works but why?"] },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { episodeId, selectedGame, personaId, genericSummary, alignment } = await request.json();

    if (!episodeId || !selectedGame) {
      return NextResponse.json(
        { error: "Missing episodeId or selectedGame" },
        { status: 400 }
      );
    }

    let audienceScenarios: Array<{
      problem: string;
      background: string;
      reaction: string;
      helped: string;
      missed: string;
    }> = [];
    
    let reactions = {
      type: "mixed",
      reactions: ["Interesting content", "Good insights"],
    };

    // Set timeout for audience simulator (25s max to avoid total timeout)
    const AUDIENCE_SIMULATOR_TIMEOUT = 25000;

    try {
      const audienceSimulatorPromise = (async () => {
        const audienceSimulator = mastra.getAgentById('audience-simulator-agent');
        
        if (!audienceSimulator) {
          return null;
        }

        const personas: Record<string, { name: string; problem: string; primaryGames: string[]; success: string }> = {
          "independent-author": {
            name: "The Independent Author",
            problem: "Traditional vs self-publishing decision",
            primaryGames: ["G2", "G4"],
            success: "Clear ROI framework + control",
          },
          "systems-thinker": {
            name: "The Systems Thinker",
            problem: "Understanding leverage vs distribution",
            primaryGames: ["G3"],
            success: "Transferable mental model",
          },
          "community-builder": {
            name: "The Community Builder",
            problem: "Building durable audience trust",
            primaryGames: ["G6"],
            success: "Long-term cohesion, not virality",
          },
          "meaning-seeker": {
            name: "The Meaning-Seeker",
            problem: "Navigating identity change via work",
            primaryGames: ["G5"],
            success: "Narrative clarity + orientation",
          },
        };

        const currentPersona = personaId ? personas[personaId] : null;
        
        const gameDescriptions: Record<string, string> = {
          G1: "Identity/Canon: Builds lineage, shapes taste, creates belonging through heroes/archetypes/norms",
          G2: "Idea/Play Mining: Extracts actionable insights from history/stories, translates to modern tactical plays",
          G3: "Model/Understanding: Builds mental frameworks, explains systems, reduces confusion through transferable models",
          G4: "Performance/Coaching: Focuses on execution, skill development, measurable outcomes and improvement",
          G5: "Meaning/Sensemaking: Helps people make sense of change, identity, values, and uncertainty",
          G6: "Network/Coordination: Orchestrates people, creates connections, builds trust networks and relationships",
        };

        const personaContext = currentPersona 
          ? `Focus on scenarios for ${currentPersona.name} - someone facing "${currentPersona.problem}". Their primary game orientation is ${currentPersona.primaryGames.join(", ")}, and success for them means: ${currentPersona.success}.`
          : "";

        // Optimize prompt - use shorter summary
        const shortSummary = (genericSummary || "").length > 500 
          ? (genericSummary || "").substring(0, 500) + '...'
          : genericSummary;
        
        const simulatorPrompt = `Generate 2-3 audience scenarios for ${selectedGame} - ${gameDescriptions[selectedGame]}. ${personaContext}

Summary: ${shortSummary || "Episode content analysis"}
Alignment: ${alignment || 0}%

Return JSON only:
{
  "scenarios": [
    {
      "problem": "their problem",
      "background": "brief context",
      "reaction": "their reaction",
      "helped": "what helped",
      "missed": "what was missing"
    }
  ]
}`;

        const simulatorThreadId = `audience-${episodeId}-${selectedGame}`;
        const simulatorResourceId = `episode-${episodeId}`;
        
        const simulatorStream = await audienceSimulator.stream([
          { role: 'user' as const, content: simulatorPrompt },
        ], {
          memory: {
            thread: simulatorThreadId,
            resource: simulatorResourceId,
          },
        });

        let simulatorText = '';
        for await (const chunk of simulatorStream.textStream) {
          simulatorText += chunk;
        }

        try {
          const jsonMatch = simulatorText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.scenarios && Array.isArray(parsed.scenarios)) {
              return parsed.scenarios;
            }
          }
        } catch (parseError) {
          console.error('Failed to parse audience simulator response:', parseError);
        }
        return null;
      })();

      // Race against timeout
      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => {
          console.warn('Audience simulator timeout - skipping scenarios');
          resolve(null);
        }, AUDIENCE_SIMULATOR_TIMEOUT)
      );

      const scenariosResult = await Promise.race([
        audienceSimulatorPromise,
        timeoutPromise,
      ]);

      if (scenariosResult && scenariosResult.length > 0) {
        audienceScenarios = scenariosResult;
        reactions = {
          type: (alignment || 0) > 50 ? `${selectedGame}-aligned` : `${selectedGame}-misaligned`,
          reactions: audienceScenarios.map(s => s.reaction).slice(0, 3),
        };
        console.log(`Generated ${audienceScenarios.length} audience scenarios`);
      } else {
        reactions = audienceReactions[episodeId]?.[selectedGame] || {
          type: "mixed",
          reactions: ["Interesting content", "Good insights"],
        };
      }
    } catch (error) {
      console.error('Audience simulator error:', error);
      reactions = audienceReactions[episodeId]?.[selectedGame] || {
        type: "mixed",
        reactions: ["Interesting content", "Good insights"],
      };
    }

    return NextResponse.json({
      reactions,
      audienceScenarios: audienceScenarios.length > 0 ? audienceScenarios : undefined,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: "Failed to generate audience scenarios", message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
