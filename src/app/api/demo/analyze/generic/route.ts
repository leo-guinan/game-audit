import { NextRequest, NextResponse } from "next/server";
import { mastra } from "@/mastra";
import { sql } from "@vercel/postgres";
import fs from "fs";
import path from "path";

// Increase timeout for this route (up to 60s on Vercel free plan)
export const maxDuration = 60;

// Fallback generic summaries
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

export async function POST(request: NextRequest) {
  try {
    const { episodeId, personaId } = await request.json();

    if (!episodeId) {
      return NextResponse.json(
        { error: "Missing episodeId" },
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
      if (!episode) {
        throw new Error(`Episode not found: ${episodeId}`);
      }

      const filePath = path.join(
        process.cwd(),
        "src/app/api/intake/data",
        episode.category,
        episode.file
      );
      
      content = fs.readFileSync(filePath, "utf-8");
      console.log(`Loaded episode content: ${content.length} characters from ${filePath}`);
    } catch (error) {
      console.error('Error loading episode content:', error);
      // Continue with fallback summary
    }

    let genericSummary = "";

    // Try to fetch from database first
    try {
      const cached = await sql`
        SELECT generic_summary FROM demo_generic_summaries
        WHERE episode_id = ${episodeId}
      `;
      
      if (cached.rows.length > 0 && cached.rows[0].generic_summary) {
        genericSummary = cached.rows[0].generic_summary;
        console.log(`Using cached generic summary for ${episodeId}`);
        return NextResponse.json({ genericSummary });
      }
    } catch (dbError) {
      console.warn('Database fetch failed, falling back to generation:', dbError);
    }

    // If not in cache, generate it
    try {
      const genericAgent = mastra.getAgentById('generic-agent');
      
      if (!genericAgent) {
        throw new Error('Generic agent not found');
      }

      if (!content || content.length < 100) {
        console.warn('Content too short for generic summary, using fallback summary');
        genericSummary = genericSummaries[episodeId] || "This episode explores key themes and insights relevant to creators and entrepreneurs.";
      } else {
        console.log(`Calling generic agent with content length: ${content.length} characters`);
        const contentToAnalyze = content.length > 20000 
          ? content.substring(0, 20000) + '\n\n[... transcript continues, focusing analysis on themes established in first section ...]'
          : content;
        
        const summaryPrompt = `You are analyzing a podcast episode transcript. Read through the transcript section below and create a neutral, generic summary (2-3 sentences) that captures the main themes and insights discussed. Focus on what the episode is actually about, not generic descriptions.

Episode Transcript:
${contentToAnalyze}

Provide a clear, specific summary that captures the main themes and insights. Be concrete and specific about what was discussed.`;

        const summaryThreadId = `analysis-${episodeId}-summary`;
        const summaryResourceId = `episode-${episodeId}`;

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
        genericSummary = summaryText.trim();
        
        // Cache the result (fire and forget)
        try {
          await sql`
            INSERT INTO demo_generic_summaries (episode_id, generic_summary, updated_at)
            VALUES (${episodeId}, ${genericSummary}, NOW())
            ON CONFLICT (episode_id) DO UPDATE
            SET generic_summary = EXCLUDED.generic_summary, updated_at = NOW()
          `;
          console.log(`Cached generic summary for ${episodeId}`);
        } catch (cacheError) {
          console.warn('Failed to cache generic summary:', cacheError);
        }
      }
    } catch (error) {
      console.error('Generic agent error:', error);
    }

    // Use fallback if agent didn't produce a summary
    if (!genericSummary) {
      genericSummary = genericSummaries[episodeId] || "This episode explores key themes and insights relevant to creators and entrepreneurs.";
    }

    return NextResponse.json({
      genericSummary,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: "Failed to generate generic summary", message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
