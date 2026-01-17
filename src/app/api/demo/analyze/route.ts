import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";

// Increase timeout for this route (up to 60s on Vercel free plan)
// Multiple agent calls can take 10-30+ seconds
export const maxDuration = 60;

// Game alignment scores (simulated - can be replaced with real Mastra analysis)
const gameAlignmentScores: Record<string, Record<string, number>> = {
  "bill-gates": {
    G1: 0.82, // Identity/Canon - High (about founder archetypes)
    G2: 0.45, // Idea Mining - Medium
    G3: 0.58, // Model/Understanding - Medium-high
    G4: 0.35, // Performance/Coaching - Low
    G5: 0.42, // Meaning/Sensemaking - Low-medium
    G6: 0.38, // Network/Coordination - Low
  },
  "jenny": {
    G1: 0.28,
    G2: 0.78, // Idea Mining - High (tactical extraction)
    G3: 0.52,
    G4: 0.65,
    G5: 0.35,
    G6: 0.42,
  },
  "paul-millerd": {
    G1: 0.38,
    G2: 0.52,
    G3: 0.75, // Model/Understanding - High
    G4: 0.48,
    G5: 0.58,
    G6: 0.45,
  },
  // Default for others
  default: {
    G1: 0.40,
    G2: 0.45,
    G3: 0.50,
    G4: 0.40,
    G5: 0.45,
    G6: 0.40,
  },
};

const gameFailures: Record<string, Record<string, string[]>> = {
  "bill-gates": {
    G1: [
      "Strong archetype (Bill Gates as founder model)",
      "Clear lineage and tradition (early computing pioneers)",
      "Emphasis on sacrifice and commitment",
    ],
    G2: [
      "Limited explicit tactical extraction",
      "More about identity than actionable plays",
      "Abstract rather than concrete moves",
    ],
    G3: [
      "Some systems thinking present",
      "Not primarily focused on transferable models",
      "More biographical than analytical",
    ],
  },
  "jenny": {
    G1: [
      "No clear archetype or exemplar",
      "Lacks traditional lineage",
      "Practical, not canonical",
    ],
    G2: [
      "Strong tactical extraction",
      "Clear actionable moves",
      "Concrete frameworks",
    ],
    G3: [
      "Some models but not primary focus",
      "More tactical than systematic",
      "Practical over theoretical",
    ],
  },
};

const audienceReactions: Record<string, Record<string, { type: string; reactions: string[] }>> = {
  "bill-gates": {
    G1: {
      type: "G1-aligned",
      reactions: [
        "This reframes what commitment actually costs.",
        "This changes how I think about founders.",
        "Gates as archetype: relentless focus.",
      ],
    },
    G2: {
      type: "G2-misaligned",
      reactions: [
        "Cool thread 💯",
        "Any actionable tips?",
        "Interesting but what do I do with this?",
      ],
    },
    G3: {
      type: "G3-misaligned",
      reactions: [
        "This reminds me of hustle culture",
        "Good story, but how does it actually work?",
        "Where's the model?",
      ],
    },
  },
  "jenny": {
    G1: {
      type: "G1-misaligned",
      reactions: [
        "Where's the deeper meaning?",
        "Seems superficial",
        "No archetype here",
      ],
    },
    G2: {
      type: "G2-aligned",
      reactions: [
        "These are the exact moves I needed!",
        "How do I extract this for my content?",
        "Clear tactical breakdown.",
      ],
    },
    G3: {
      type: "G3-misaligned",
      reactions: [
        "Good tips but what's the system?",
        "Tactical without theory",
        "Works but why?",
      ],
    },
  },
};

export async function POST(request: NextRequest) {
  try {
      const { episodeId, selectedGame, personaId } = await request.json();

    if (!episodeId) {
      return NextResponse.json(
        { error: "Missing episodeId" },
        { status: 400 }
      );
    }

    // Return generic summary if requested
    if (!selectedGame) {
      return NextResponse.json(
        { error: "Missing selectedGame" },
        { status: 400 }
      );
    }

    // Load episode content for analysis
    let content = "";
    try {
      const episodeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/demo/episodes?id=${episodeId}`
      );
      
      if (!episodeResponse.ok) {
        console.error('Failed to fetch episode:', {
          status: episodeResponse.status,
          statusText: episodeResponse.statusText,
          episodeId,
        });
        throw new Error(`Failed to fetch episode: ${episodeResponse.status} ${episodeResponse.statusText}`);
      }
      
      const episodeData = await episodeResponse.json();
      
      // Use fullContent for proper analysis, fallback to content if fullContent not available
      content = episodeData.fullContent || episodeData.content || "";
      
      if (!content || content.length < 100) {
        console.error('Episode content is too short or missing:', {
          episodeId,
          contentLength: content?.length || 0,
          hasFullContent: !!episodeData.fullContent,
          hasContent: !!episodeData.content,
        });
        // Don't throw here, we'll use fallback summaries
      }
    } catch (error) {
      console.error('Error loading episode content:', error);
      // Continue with empty content - we'll use fallback summaries
      content = "";
    }

    // Fallback generic summaries (define early for use in try block)
    const genericSummaries: Record<string, string> = {
      "bill-gates":
        "This episode discusses the importance of focus, long-term thinking, and disciplined execution as key drivers of sustained success. It explores how Bill Gates's early obsession with programming led to building Microsoft through relentless dedication and strategic decision-making.",
      "jenny":
        "This episode breaks down the tactical frameworks for creating viral short-form content, including hook optimization, retention strategies, and visual-first storytelling approaches that drive engagement on platforms like YouTube Shorts.",
      "paul-millerd":
        "This episode examines the distinction between distribution strategies and leverage mechanisms in creator businesses, analyzing how different approaches to audience building create different types of value and long-term sustainability.",
      "james-dyson":
        "This episode explores innovation through persistence, examining how James Dyson's thousands of prototypes and refusal to compromise led to breakthrough products that transformed entire industries.",
      "tommy":
        "This episode analyzes viral content strategies and distribution tactics, breaking down what makes certain content travel while similar pieces fail to gain traction.",
    };

    // Use Mastra agent to analyze content
    let alignment = 0.42;
    let failures: string[] = [];
    let genericSummary = "";

    try {
      // Get agents by ID using the same pattern as the example
      const genericAgent = mastra.getAgentById('generic-agent');
      const gameAnalyzerAgent = mastra.getAgentById('game-analyzer-agent');
      
      if (!genericAgent || !gameAnalyzerAgent) {
        throw new Error('Agents not found');
      }

      // Generate generic summary using agent.stream() with memory persistence
      const summaryThreadId = `analysis-${episodeId}-summary`;
      const summaryResourceId = `episode-${episodeId}`;
      
      // Ensure we have content to analyze
      if (!content || content.length < 100) {
        console.warn('Content too short, using fallback summary');
        genericSummary = genericSummaries[episodeId] || "This episode explores key themes and insights relevant to creators and entrepreneurs.";
      } else {
        console.log(`Calling generic agent with content length: ${content.length} characters`);
        
        // Create a more explicit prompt for the generic agent
        // Send substantial portion of content (up to 20000 chars) to get good analysis
        // For very long episodes, we'll get the beginning which usually contains the main themes
        const contentToAnalyze = content.length > 20000 
          ? content.substring(0, 20000) + '\n\n[... transcript continues, focusing analysis on themes established in first section ...]'
          : content;
        
        const summaryPrompt = `You are analyzing a podcast episode transcript. Read through the transcript section below and create a neutral, generic summary (2-3 sentences) that captures the main themes and insights discussed. Focus on what the episode is actually about, not generic descriptions.

Episode Transcript:
${contentToAnalyze}

Provide a clear, specific summary that captures the main themes and insights. Be concrete and specific about what was discussed.`;

        const summaryStream = await genericAgent.stream([
          { role: 'user' as const, content: summaryPrompt },
        ], {
          memory: {
            thread: summaryThreadId,
            resource: summaryResourceId,
          },
        });
        
        let summaryText = '';
        let chunkCount = 0;
        for await (const chunk of summaryStream.textStream) {
          summaryText += chunk;
          chunkCount++;
        }
        
        console.log(`Generic agent processed ${chunkCount} chunks, returned summary length: ${summaryText.length} characters`);
        console.log(`Summary preview: ${summaryText.substring(0, 100)}...`);
        
        genericSummary = summaryText.trim() || genericSummaries[episodeId] || "This episode explores key themes and insights relevant to creators and entrepreneurs.";
      }

      // Analyze alignment with selected game (only for specific games, not "generic")
      if (selectedGame && selectedGame !== "generic") {
        // Only analyze if we have sufficient content
        if (content && content.length >= 100) {
          const gameDescriptions: Record<string, string> = {
            G1: "Identity/Canon: Builds lineage, shapes taste, creates belonging through heroes/archetypes/norms",
            G2: "Idea/Play Mining: Extracts actionable insights from history/stories, translates to modern tactical plays",
            G3: "Model/Understanding: Builds mental frameworks, explains systems, reduces confusion through transferable models",
            G4: "Performance/Coaching: Focuses on execution, skill development, measurable outcomes and improvement",
            G5: "Meaning/Sensemaking: Helps people make sense of change, identity, values, and uncertainty",
            G6: "Network/Coordination: Orchestrates people, creates connections, builds trust networks and relationships",
          };

          // Use substantial content for game analysis (up to 15000 chars)
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

          // Analyze with game-specific thread for persistence
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
          
          // Try to parse JSON from response
          try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              let rawAlignment = parsed.alignment || 0.42;
              
              // Normalize alignment to 0-100 range
              // If value is > 1, assume it's already 0-100, otherwise assume 0-1
              if (rawAlignment > 1) {
                alignment = Math.min(100, Math.max(0, rawAlignment));
              } else {
                alignment = Math.min(100, Math.max(0, rawAlignment * 100));
              }
              failures = parsed.reasons || [];
            }
          } catch {
            // Fallback: extract alignment from text
            const alignmentMatch = analysisText.match(/(\d+)%/);
            if (alignmentMatch) {
              alignment = Math.min(100, Math.max(0, parseInt(alignmentMatch[1])));
            }
            // Extract failure reasons
            failures = analysisText.split('\n').filter(line => 
              line.includes('•') || line.includes('-') || line.match(/^\d+\./)
            ).slice(0, 3);
          }
        } else {
          // Content missing - use fallback data
          console.warn('Content too short for game analysis, using fallback data');
          const scores = gameAlignmentScores[episodeId] || gameAlignmentScores.default;
          alignment = scores[selectedGame] || 0.42;
          failures = gameFailures[episodeId]?.[selectedGame] || [];
        }
      }
    } catch (error) {
      console.error('Mastra analysis error:', error);
      // Fallback to simulated data (only for specific games, not "generic")
      if (selectedGame && selectedGame !== "generic") {
        const scores = gameAlignmentScores[episodeId] || gameAlignmentScores.default;
        alignment = scores[selectedGame] || 0.42;
        failures = gameFailures[episodeId]?.[selectedGame] || [];
      }
      // For "generic", alignment stays at default (0.42)
    }

    if (!genericSummary) {
      genericSummary = genericSummaries[episodeId] || "This episode explores key themes and insights relevant to creators and entrepreneurs.";
    }

    // Generate audience scenarios using the audience simulator agent (only for specific games, not generic)
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

    // Only generate audience scenarios if we have a specific game selected
    if (selectedGame && selectedGame !== "generic") {
      try {
        const audienceSimulator = mastra.getAgentById('audience-simulator-agent');
        
        if (audienceSimulator) {
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

          const simulatorPrompt = `Generate 2-3 realistic audience scenarios for people trying to solve problems in ${selectedGame} - ${gameDescriptions[selectedGame]}. ${personaContext}

Episode Content Summary: ${genericSummary}
Episode Alignment with ${selectedGame}: ${Math.round(alignment)}%

Create authentic scenarios where people come to this episode looking for help with their ${selectedGame} problem. Show:
1. Their specific problem/challenge
2. Brief background about who they are
3. How they react to the episode (be honest - positive if aligned, frustrated if misaligned)
4. What specifically helped them (or "nothing concrete" if misaligned)
5. What they needed but didn't get

Return your response as JSON:
{
  "scenarios": [
    {
      "problem": "specific problem they're trying to solve",
      "background": "brief context about them",
      "reaction": "their authentic reaction to the episode",
      "helped": "what from the episode helped them",
      "missed": "what they needed but didn't get"
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

        // Parse scenarios from response
        try {
          const jsonMatch = simulatorText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.scenarios && Array.isArray(parsed.scenarios)) {
              audienceScenarios = parsed.scenarios;
              
              // Generate reaction snippets from scenarios
              reactions = {
                type: alignment > 50 ? `${selectedGame}-aligned` : `${selectedGame}-misaligned`,
                reactions: audienceScenarios.map(s => s.reaction).slice(0, 3),
              };
            }
          }
        } catch (parseError) {
          console.error('Failed to parse audience simulator response:', parseError);
        }
      }
      } catch (error) {
        console.error('Audience simulator error:', error);
        // Fallback to hardcoded reactions
        reactions = audienceReactions[episodeId]?.[selectedGame] || {
          type: "mixed",
          reactions: ["Interesting content", "Good insights"],
        };
      }
    } else {
      // Use fallback reactions for generic requests
      reactions = audienceReactions[episodeId]?.[selectedGame || 'default'] || {
        type: "mixed",
        reactions: ["Interesting content", "Good insights"],
      };
    }

    // Ensure alignment is in 0-100 range
    alignment = Math.min(100, Math.max(0, alignment));
    
    // Calculate audience engagement distribution
    const alignmentScore = alignment / 100;
    const audienceEngagement = {
      aligned: Math.round(alignmentScore * 100),
      misaligned1: Math.round((1 - alignmentScore) * 0.4 * 100),
      misaligned2: Math.round((1 - alignmentScore) * 0.6 * 100),
    };

    return NextResponse.json({
      alignment: Math.round(alignment),
      failures,
      genericSummary,
      reactions,
      audienceEngagement,
      audienceScenarios: audienceScenarios.length > 0 ? audienceScenarios : undefined,
    });
  } catch (error) {
    console.error('API route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: "Failed to analyze",
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}
