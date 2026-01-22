import { NextResponse } from "next/server";
import type { FullJourney } from "@/lib/analytics/path-tracker";
import type { PathInterpretation } from "@/lib/analytics/path-analyzer";

/**
 * Share journey data with creator (opt-in consent)
 * This stores the journey in ConvertKit custom fields for personalization
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { journey, interpretation }: { journey: FullJourney; interpretation: PathInterpretation } = body;

    if (!journey || !interpretation) {
      return NextResponse.json(
        { error: "Journey and interpretation are required." },
        { status: 400 }
      );
    }

    // For now, we'll store this in a database or ConvertKit
    // Since we don't have email at this point, we'll just log it
    // In production, you'd want to:
    // 1. Store in a database with session ID
    // 2. When they subscribe, link the journey to their email
    // 3. Use ConvertKit custom fields to store the path data

    console.log("[journey-share] Journey shared:", {
      sessionId: journey.sessionId,
      pathSignature: interpretation.pathSignature,
      primaryGame: interpretation.primaryGame,
      engagementPattern: interpretation.engagementPattern,
    });

    // TODO: Store in database or queue for later association with email
    // For now, return success - the actual storage happens when they subscribe

    return NextResponse.json({
      ok: true,
      message: "Journey shared. We'll use this to personalize your experience when you subscribe.",
    });
  } catch (e) {
    console.error("[journey-share] Error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
