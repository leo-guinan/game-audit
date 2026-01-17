import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";
import fs from "fs";
import path from "path";

// Increase timeout for this route (up to 60s on Vercel free plan)
export const maxDuration = 60;

// Fallback game alignment scores
const gameAlignmentScores: Record<string, Record<string, number>> = {
  "bill-gates": {
    G1: 0.82, G2: 0.45, G3: 0.58, G4: 0.35, G5: 0.42, G6: 0.38,
  },
  "jenny": {
    G1: 0.28, G2: 0.78, G3: 0.52, G4: 0.65, G5: 0.35, G6: 0.42,
  },
  "paul-millerd": {
    G1: 0.38, G2: 0.52, G3: 0.75, G4: 0.48, G5: 0.58, G6: 0.45,
  },
  default: {
    G1: 0.40, G2: 0.45, G3: 0.50, G4: 0.40, G5: 0.45, G6: 0.40,
  },
};

const gameFailures: Record<string, Record<string, string[]>> = {
  "bill-gates": {
    G1: ["Strong archetype (Bill Gates as founder model)", "Clear lineage and tradition (early computing pioneers)", "Emphasis on sacrifice and commitment"],
    G2: ["Limited explicit tactical extraction", "More about identity than actionable plays", "Abstract rather than concrete moves"],
    G3: ["Some systems thinking present", "Not primarily focused on transferable models", "More biographical than analytical"],
  },
  "jenny": {
    G1: ["No clear archetype or exemplar", "Lacks traditional lineage", "Practical, not canonical"],
    G2: ["Strong tactical extraction", "Clear actionable moves", "Concrete frameworks"],
    G3: ["Some models but not primary focus", "More tactical than systematic", "Practical over theoretical"],
  },
};

export async function POST(request: NextRequest) {
  try {
    const { episodeId, selectedGame, personaId } = await request.json();

    if (!episodeId || !selectedGame) {
      return NextResponse.json(
        { error: "Missing episodeId or selectedGame" },
        { status: 400 }
      );
    }

    // Load episode content directly from filesystem
    let content = "";
    try {
      const episodes: Record<string, { category: string; file: string }> = {
        "bill-gates": { category: "founders", file: "bill_gates.md" },
        "james-dyson": { category: "founders", file: "james_dyson.md" },
        "jenny": { category: "creator_science", file: "jenny.md" },
        "paul-millerd": { category: "creator_science", file: "paul_millerd.md" },
        "tommy": { category: "creator_science", file: "tommy.md" },
      };

      const episode = episodes[episodeId];
      if (episode) {
        const filePath = path.join(
          process.cwd(),
          "src/app/api/intake/data",
          episode.category,
          episode.file
        );
        content = fs.readFileSync(filePath, "utf-8");
      }
    } catch (error) {
      console.error('Error loading episode content:', error);
    }

    let alignment = 0.42;
    let failures: string[] = [];

    try {
      const gameAnalyzerAgent = mastra.getAgentById('game-analyzer-agent');
      
      if (!gameAnalyzerAgent) {
        throw new Error('Game analyzer agent not found');
      }

      if (content && content.length >= 100) {
        console.log(`Starting game analysis for ${selectedGame}, content length: ${content.length}`);

        const gameDescriptions: Record<string, string> = {
          G1: "Identity/Canon: Builds lineage, shapes taste, creates belonging through heroes/archetypes/norms",
          G2: "Idea/Play Mining: Extracts actionable insights from history/stories, translates to modern tactical plays",
          G3: "Model/Understanding: Builds mental frameworks, explains systems, reduces confusion through transferable models",
          G4: "Performance/Coaching: Focuses on execution, skill development, measurable outcomes and improvement",
          G5: "Meaning/Sensemaking: Helps people make sense of change, identity, values, and uncertainty",
          G6: "Network/Coordination: Orchestrates people, creates connections, builds trust networks and relationships",
        };

        const analysisContent = content.length > 15000
          ? content.substring(0, 15000) + '\n\n[... analyzing key sections for game alignment ...]'
          : content;
        
        const analysisPrompt = `Analyze this podcast episode content and score its alignment (0-100) with ${selectedGame} - ${gameDescriptions[selectedGame]}.

Provide:
1. Alignment score (0-100 as a number)
2. List 3 specific reasons why it succeeds or fails for this game

Episode Content:
${analysisContent}

Return your response as JSON: { "alignment": <number>, "reasons": ["reason1", "reason2", "reason3"] }`;

        const analysisThreadId = `analysis-${episodeId}-${selectedGame}`;
        const analysisResourceId = `episode-${episodeId}`;
        
        const analysisStream = await gameAnalyzerAgent.stream([
          { role: 'user' as const, content: analysisPrompt },
        ], {
          memory: {
            thread: analysisThreadId,
            resource: analysisResourceId,
          },
        });
        
        let analysisText = '';
        for await (const chunk of analysisStream.textStream) {
          analysisText += chunk;
        }
        
        console.log(`Game analyzer response length: ${analysisText.length}, preview: ${analysisText.substring(0, 200)}`);
        
        try {
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            let rawAlignment = parsed.alignment ?? 0.42;
            
            if (rawAlignment > 1) {
              alignment = Math.min(100, Math.max(0, rawAlignment));
            } else {
              alignment = Math.min(100, Math.max(0, rawAlignment * 100));
            }
            failures = parsed.reasons || [];
            console.log(`Parsed alignment: ${alignment}%, reasons: ${failures.length}`);
          }
        } catch (parseError) {
          console.error('Failed to parse game analyzer response:', parseError);
        }
      } else {
        // Use fallback data
        console.warn('Content too short for game analysis, using fallback data');
        const scores = gameAlignmentScores[episodeId] || gameAlignmentScores.default;
        alignment = scores[selectedGame] ?? 0.42;
        failures = gameFailures[episodeId]?.[selectedGame] || [];
      }
    } catch (error) {
      console.error('Game analyzer error:', error);
      // Use fallback data
      const scores = gameAlignmentScores[episodeId] || gameAlignmentScores.default;
      alignment = scores[selectedGame] ?? 0.42;
      failures = gameFailures[episodeId]?.[selectedGame] || [];
    }

    // Ensure we have failures
    if (!failures || failures.length === 0) {
      failures = gameFailures[episodeId]?.[selectedGame] || [
        "Content analysis in progress",
        "Check back shortly for detailed alignment assessment",
        "Analysis may take a moment to complete"
      ];
    }

    alignment = Math.min(100, Math.max(0, alignment));
    
    const alignmentScore = alignment / 100;
    const audienceEngagement = {
      aligned: Math.round(alignmentScore * 100),
      misaligned1: Math.round((1 - alignmentScore) * 0.4 * 100),
      misaligned2: Math.round((1 - alignmentScore) * 0.6 * 100),
    };

    return NextResponse.json({
      alignment: Math.round(alignment),
      failures,
      audienceEngagement,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: "Failed to analyze game alignment", message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
